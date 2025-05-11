import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { storage } from "./storage";
import * as XLSX from "xlsx";
import { z } from "zod";
import { type FileData, type LookupOptions, type LookupResultData, insertLookupJobSchema, insertLookupResultSchema } from "@shared/schema";
import path from "path";
import fs from "fs";

// Configure multer storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext === '.csv' || ext === '.xlsx' || ext === '.xls') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV and Excel files are allowed'));
    }
  }
});

// Parse file data (CSV or Excel)
function parseFileData(buffer: Buffer, filename: string): FileData {
  const ext = path.extname(filename).toLowerCase();
  const workbook = XLSX.read(buffer, { type: 'buffer' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const jsonData = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet);
  
  if (jsonData.length === 0) {
    throw new Error('File is empty or has no valid data');
  }
  
  const columns = Object.keys(jsonData[0]);
  
  return {
    columns,
    rows: jsonData
  };
}

// Perform VLOOKUP operation
function performLookup(source: FileData, lookup: FileData, options: LookupOptions): LookupResultData {
  const { sourceKeyColumn, lookupKeyColumn, sourceColumns, lookupColumns } = options;
  
  // Build lookup map for faster access
  const lookupMap = new Map<string, Record<string, any>>();
  lookup.rows.forEach(row => {
    const key = String(row[lookupKeyColumn]);
    if (key) {
      lookupMap.set(key, row);
    }
  });
  
  const results: Record<string, any>[] = [];
  let matches = 0;
  let nonMatches = 0;
  
  // Perform lookup for each source row
  source.rows.forEach(sourceRow => {
    const sourceKey = String(sourceRow[sourceKeyColumn]);
    const resultRow: Record<string, any> = {};
    
    // Add source columns
    sourceColumns.forEach(col => {
      resultRow[col] = sourceRow[col];
    });
    
    // Add lookup columns if match is found
    const lookupRow = lookupMap.get(sourceKey);
    if (lookupRow) {
      lookupColumns.forEach(col => {
        resultRow[col] = lookupRow[col];
      });
      matches++;
    } else {
      // Add placeholder for lookup columns
      lookupColumns.forEach(col => {
        resultRow[col] = null;
      });
      nonMatches++;
    }
    
    // Add a flag to indicate if the row has a match
    resultRow._hasMatch = !!lookupRow;
    
    results.push(resultRow);
  });
  
  return {
    results,
    totalMatches: matches,
    totalNonMatches: nonMatches
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // API endpoint to get file columns
  app.post('/api/files/columns', upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      
      const fileData = parseFileData(req.file.buffer, req.file.originalname);
      
      res.json({
        filename: req.file.originalname,
        columns: fileData.columns
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  // API endpoint to perform lookup operation
  app.post('/api/lookup', upload.fields([
    { name: 'sourceFile', maxCount: 1 },
    { name: 'lookupFile', maxCount: 1 }
  ]), async (req, res) => {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      
      if (!files.sourceFile || !files.lookupFile) {
        return res.status(400).json({ message: 'Both source and lookup files are required' });
      }
      
      const optionsSchema = z.object({
        sourceKeyColumn: z.string(),
        lookupKeyColumn: z.string(),
        sourceColumns: z.array(z.string()),
        lookupColumns: z.array(z.string())
      });
      
      const parsedOptions = optionsSchema.safeParse(JSON.parse(req.body.options));
      
      if (!parsedOptions.success) {
        return res.status(400).json({ message: 'Invalid options provided', errors: parsedOptions.error.format() });
      }
      
      const options = parsedOptions.data;
      
      // Parse both files
      const sourceFile = files.sourceFile[0];
      const lookupFile = files.lookupFile[0];
      
      const sourceData = parseFileData(sourceFile.buffer, sourceFile.originalname);
      const lookupData = parseFileData(lookupFile.buffer, lookupFile.originalname);
      
      // Perform lookup
      const result = performLookup(sourceData, lookupData, options);
      
      // Create lookup job record
      const job = await storage.createLookupJob({
        sourceFileName: sourceFile.originalname,
        lookupFileName: lookupFile.originalname,
        sourceKeyColumn: options.sourceKeyColumn,
        lookupKeyColumn: options.lookupKeyColumn,
        sourceColumns: options.sourceColumns,
        lookupColumns: options.lookupColumns,
        userId: null // No user authentication in this version
      });
      
      // Create lookup result record
      const lookupResult = await storage.createLookupResult({
        jobId: job.id,
        results: result.results,
        totalMatches: result.totalMatches,
        totalNonMatches: result.totalNonMatches
      });
      
      res.json({
        jobId: job.id,
        resultId: lookupResult.id,
        ...result
      });
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'An unexpected error occurred' });
      }
    }
  });
  
  // API endpoint to get results
  app.get('/api/results/:jobId', async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      
      if (isNaN(jobId)) {
        return res.status(400).json({ message: 'Invalid job ID' });
      }
      
      const job = await storage.getLookupJob(jobId);
      
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
      
      const result = await storage.getLookupResultByJobId(jobId);
      
      if (!result) {
        return res.status(404).json({ message: 'Result not found' });
      }
      
      res.json({
        job,
        ...result
      });
    } catch (error) {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  });
  
  // API endpoint to export results
  app.get('/api/export/:jobId', async (req, res) => {
    try {
      const jobId = parseInt(req.params.jobId);
      
      if (isNaN(jobId)) {
        return res.status(400).json({ message: 'Invalid job ID' });
      }
      
      const result = await storage.getLookupResultByJobId(jobId);
      
      if (!result) {
        return res.status(404).json({ message: 'Result not found' });
      }
      
      // Create Excel workbook
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(result.results.map(row => {
        // Create a copy without the _hasMatch property
        const { _hasMatch, ...rest } = row;
        return rest;
      }));
      
      XLSX.utils.book_append_sheet(wb, ws, "Results");
      
      // Convert to buffer
      const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
      
      res.setHeader('Content-Disposition', 'attachment; filename="vlookup-results.xlsx"');
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.send(buffer);
    } catch (error) {
      res.status(500).json({ message: 'An unexpected error occurred' });
    }
  });

  return httpServer;
}
