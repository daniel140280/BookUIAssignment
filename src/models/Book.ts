/*
The models/Book.ts file defines the TypeScript interfaces and constants related to the Book data model.
*/

export interface Book {
  id: number;
  title: string;
  author: string;
  date: string;       // Format DD/MM/YYYY
  genres: string;
  characters: string;
  synopsis: string;
}

export type DataFormat = 'json' | 'xml' | 'text';

export const FORMAT_LABELS: Record<DataFormat, string> = {
  json: 'JSON',
  xml:  'XML',
  text: 'Plain Text',
};

export const CONTENT_TYPES: Record<DataFormat, string> = {
  json: 'application/json',
  xml:  'application/xml',
  text: 'text/plain',
};

export const ACCEPT_HEADERS: Record<DataFormat, string> = {
  json: 'application/json',
  xml:  'application/xml',
  text: 'text/plain',
};
