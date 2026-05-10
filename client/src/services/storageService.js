/**
 * Storage Service - Handles local persistence of applied and saved jobs
 * Provides fallback when API is unavailable and ensures data consistency
 */

const STORAGE_KEYS = {
  SAVED_JOBS: 'jobportal_saved_jobs',
  APPLIED_JOBS: 'jobportal_applied_jobs',
  USER_ID: 'jobportal_user_id',
  SYNC_TIMESTAMP: 'jobportal_sync_timestamp',
};

// Initialize storage with default values
const initializeStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.SAVED_JOBS)) {
    localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify({}));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS)) {
    localStorage.setItem(STORAGE_KEYS.APPLIED_JOBS, JSON.stringify({}));
  }
};

// Get saved jobs for current user
export const getSavedJobsLocal = (userId) => {
  initializeStorage();
  const allSaved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS) || '{}');
  return allSaved[userId] || [];
};

// Save a job locally
export const addSavedJobLocal = (userId, job) => {
  initializeStorage();
  const allSaved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS) || '{}');
  if (!allSaved[userId]) {
    allSaved[userId] = [];
  }
  // Avoid duplicates
  const exists = allSaved[userId].some(j => j._id === job._id);
  if (!exists) {
    allSaved[userId].push(job);
  }
  localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(allSaved));
  return allSaved[userId];
};

// Remove saved job locally
export const removeSavedJobLocal = (userId, jobId) => {
  initializeStorage();
  const allSaved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS) || '{}');
  if (allSaved[userId]) {
    allSaved[userId] = allSaved[userId].filter(job => job._id !== jobId);
  }
  localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(allSaved));
  return allSaved[userId] || [];
};

// Get applied jobs for current user
export const getAppliedJobsLocal = (userId) => {
  initializeStorage();
  const allApplied = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS) || '{}');
  return allApplied[userId] || [];
};

// Add applied job locally
export const addAppliedJobLocal = (userId, application) => {
  initializeStorage();
  const allApplied = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS) || '{}');
  if (!allApplied[userId]) {
    allApplied[userId] = [];
  }
  // Avoid duplicates - update if exists
  const index = allApplied[userId].findIndex(app => app.jobId === application.jobId);
  if (index >= 0) {
    allApplied[userId][index] = { ...allApplied[userId][index], ...application };
  } else {
    allApplied[userId].push(application);
  }
  localStorage.setItem(STORAGE_KEYS.APPLIED_JOBS, JSON.stringify(allApplied));
  return allApplied[userId];
};

// Remove applied job locally
export const removeAppliedJobLocal = (userId, jobId) => {
  initializeStorage();
  const allApplied = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS) || '{}');
  if (allApplied[userId]) {
    allApplied[userId] = allApplied[userId].filter(app => app.jobId !== jobId);
  }
  localStorage.setItem(STORAGE_KEYS.APPLIED_JOBS, JSON.stringify(allApplied));
  return allApplied[userId] || [];
};

// Sync user data to local storage (after fetching from API)
export const syncUserDataToStorage = (userId, savedJobs, appliedJobs) => {
  const allSaved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS) || '{}');
  const allApplied = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS) || '{}');
  
  allSaved[userId] = savedJobs;
  allApplied[userId] = appliedJobs;
  
  localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(allSaved));
  localStorage.setItem(STORAGE_KEYS.APPLIED_JOBS, JSON.stringify(allApplied));
  localStorage.setItem(STORAGE_KEYS.SYNC_TIMESTAMP, new Date().toISOString());
};

// Clear all data for user
export const clearUserData = (userId) => {
  const allSaved = JSON.parse(localStorage.getItem(STORAGE_KEYS.SAVED_JOBS) || '{}');
  const allApplied = JSON.parse(localStorage.getItem(STORAGE_KEYS.APPLIED_JOBS) || '{}');
  
  delete allSaved[userId];
  delete allApplied[userId];
  
  localStorage.setItem(STORAGE_KEYS.SAVED_JOBS, JSON.stringify(allSaved));
  localStorage.setItem(STORAGE_KEYS.APPLIED_JOBS, JSON.stringify(allApplied));
};

// Get last sync timestamp
export const getLastSyncTime = () => {
  return localStorage.getItem(STORAGE_KEYS.SYNC_TIMESTAMP);
};

export default {
  STORAGE_KEYS,
  getSavedJobsLocal,
  addSavedJobLocal,
  removeSavedJobLocal,
  getAppliedJobsLocal,
  addAppliedJobLocal,
  removeAppliedJobLocal,
  syncUserDataToStorage,
  clearUserData,
  getLastSyncTime,
};
