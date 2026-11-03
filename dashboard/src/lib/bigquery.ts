import { BigQuery } from "@google-cloud/bigquery";

export const bigquery = new BigQuery({
  projectId: process.env.GCP_PROJECT_ID,
});


export function table(name: string): string {
  return `\`${process.env.GCP_PROJECT_ID}.${process.env.BQ_DATASET}.${name}\``;
}