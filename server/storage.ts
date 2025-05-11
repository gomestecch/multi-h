import { users, type User, type InsertUser, type LookupJob, type InsertLookupJob, type LookupResult, type InsertLookupResult, lookupJobs, lookupResults, type FileData, type LookupOptions, type LookupResultData } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Lookup job methods
  createLookupJob(job: InsertLookupJob): Promise<LookupJob>;
  getLookupJob(id: number): Promise<LookupJob | undefined>;
  getLookupJobsByUserId(userId: number): Promise<LookupJob[]>;

  // Lookup results methods
  createLookupResult(result: InsertLookupResult): Promise<LookupResult>;
  getLookupResult(id: number): Promise<LookupResult | undefined>;
  getLookupResultByJobId(jobId: number): Promise<LookupResult | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private lookupJobs: Map<number, LookupJob>;
  private lookupResults: Map<number, LookupResult>;
  private currentUserId: number;
  private currentJobId: number;
  private currentResultId: number;

  constructor() {
    this.users = new Map();
    this.lookupJobs = new Map();
    this.lookupResults = new Map();
    this.currentUserId = 1;
    this.currentJobId = 1;
    this.currentResultId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Lookup job methods
  async createLookupJob(insertJob: InsertLookupJob): Promise<LookupJob> {
    const id = this.currentJobId++;
    const now = new Date();
    const job: LookupJob = { ...insertJob, id, createdAt: now };
    this.lookupJobs.set(id, job);
    return job;
  }

  async getLookupJob(id: number): Promise<LookupJob | undefined> {
    return this.lookupJobs.get(id);
  }

  async getLookupJobsByUserId(userId: number): Promise<LookupJob[]> {
    return Array.from(this.lookupJobs.values()).filter(
      (job) => job.userId === userId,
    );
  }

  // Lookup results methods
  async createLookupResult(insertResult: InsertLookupResult): Promise<LookupResult> {
    const id = this.currentResultId++;
    const now = new Date();
    const result: LookupResult = { ...insertResult, id, createdAt: now };
    this.lookupResults.set(id, result);
    return result;
  }

  async getLookupResult(id: number): Promise<LookupResult | undefined> {
    return this.lookupResults.get(id);
  }

  async getLookupResultByJobId(jobId: number): Promise<LookupResult | undefined> {
    return Array.from(this.lookupResults.values()).find(
      (result) => result.jobId === jobId,
    );
  }
}

export const storage = new MemStorage();
