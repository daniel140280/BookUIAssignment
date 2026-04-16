import axios from 'axios';
import type { Book, DataFormat } from '../../models/Book';
import { CONTENT_TYPES, ACCEPT_HEADERS } from '../../models/Book';
import { serialise }   from '../serialisers/bookSerialiser';
import { deserialise } from '../serialisers/bookDeserialiser';

const BASE_URL = 'http://localhost:8080/BooksRestful/Bookapi';

/*
This module provides functions to interact with the Book API on the server, performing CRUD operations. 
It handles serialisation and deserialisation of data in different formats (JSON, XML, plain text) based on the specified format.
*/

// Shared axios config — prevents axios auto-parsing the response body
const textResponse = {
  responseType: 'text' as const,
  transformResponse: (data: string) => data,
};

// Read operations

export async function getAllBooks(format: DataFormat): Promise<Book[]> {
  const res = await axios.get(BASE_URL, {
    ...textResponse,
    headers: { Accept: ACCEPT_HEADERS[format] },
  });
  return deserialise(res.data, format);
}

export async function searchBooks(query: string, format: DataFormat): Promise<Book[]> {
  const res = await axios.get(BASE_URL, {
    ...textResponse,
    params:  { q: query },
    headers: { Accept: ACCEPT_HEADERS[format] },
  });
  return deserialise(res.data, format);
}

// Create operations

export async function createBook(book: Omit<Book, 'id'>, format: DataFormat): Promise<void> {
  await axios.post(BASE_URL, serialise(book, format), {
    headers: { 'Content-Type': CONTENT_TYPES[format] },
  });
}

// Update operations

export async function updateBook(book: Book, format: DataFormat): Promise<void> {
  await axios.put(BASE_URL, serialise(book, format), {
    headers: { 'Content-Type': CONTENT_TYPES[format] },
  });
}

// Delete operations

export async function deleteBook(id: number, format: DataFormat): Promise<void> {
  await axios.delete(BASE_URL, {
    data:    serialise({ id }, format),
    headers: { 'Content-Type': CONTENT_TYPES[format] },
  });
}