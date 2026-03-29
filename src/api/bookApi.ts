import axios from 'axios';
import type { Book, DataFormat } from '../types/Book';
import { CONTENT_TYPES, ACCEPT_HEADERS } from '../types/Book';

const BASE_URL = 'http://localhost:8080/BooksRestful/Bookapi';

// ─── Serialisers ────────────────────────────────────────────────────────────

function serialiseJson(book: Partial<Book>): string {
  return JSON.stringify(book);
}

function serialiseXml(book: Partial<Book>): string {
  const tag = (name: string, value: string | number | undefined) =>
    `  <${name}>${value ?? ''}</${name}>`;

  return [
    '<Book>',
    ...(book.id !== undefined ? [tag('id', book.id)] : []),
    tag('title',      book.title),
    tag('author',     book.author),
    tag('date',       book.date),
    tag('genres',     book.genres),
    tag('characters', book.characters),
    tag('synopsis',   book.synopsis),
    '</Book>',
  ].join('\n');
}

function serialiseText(book: Partial<Book>): string {
  // Server expects ## delimiter, positional fields:
  // DELETE: id
  // POST (6 fields): title##author##date##genres##characters##synopsis
  // PUT  (7 fields): id##title##author##date##genres##characters##synopsis
  if (book.title === undefined) {
    // DELETE — only ID needed
    return String(book.id);
  }
  const parts = [
    ...(book.id !== undefined ? [String(book.id)] : []),
    book.title      ?? '',
    book.author     ?? '',
    book.date       ?? '',
    book.genres     ?? '',
    book.characters ?? '',
    book.synopsis   ?? '',
  ];
  return parts.join('##');
}

function serialise(book: Partial<Book>, format: DataFormat): string {
  switch (format) {
    case 'json': return serialiseJson(book);
    case 'xml':  return serialiseXml(book);
    case 'text': return serialiseText(book);
  }
}

// ─── Deserialisers ───────────────────────────────────────────────────────────

function parseJson(data: string): Book[] {
  const parsed = JSON.parse(data);
  return Array.isArray(parsed) ? parsed : [parsed];
}

function parseXml(data: string): Book[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(data, 'application/xml');
  // Server wraps books in <books><book>...</book></books>
  const bookNodes = doc.querySelectorAll('books > book');
  return Array.from(bookNodes).map((node) => ({
    id:         parseInt(node.querySelector('id')?.textContent ?? '0', 10),
    title:      node.querySelector('title')?.textContent ?? '',
    author:     node.querySelector('author')?.textContent ?? '',
    date:       node.querySelector('date')?.textContent ?? '',
    genres:     node.querySelector('genres')?.textContent ?? '',
    characters: node.querySelector('characters')?.textContent ?? '',
    synopsis:   node.querySelector('synopsis')?.textContent ?? '',
  }));
}

function parseText(data: string): Book[] {
  // Each line: id##title##author##date##genres##characters##synopsis
  return data
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const [id, title, author, date, genres, characters, synopsis] = line.split('##');
      return {
        id:         parseInt(id ?? '0', 10),
        title:      title      ?? '',
        author:     author     ?? '',
        date:       date       ?? '',
        genres:     genres     ?? '',
        characters: characters ?? '',
        synopsis:   synopsis   ?? '',
      };
    });
}

function parseResponse(data: string, format: DataFormat): Book[] {
  switch (format) {
    case 'json': return parseJson(data);
    case 'xml':  return parseXml(data);
    case 'text': return parseText(data);
  }
}

// ─── API calls ───────────────────────────────────────────────────────────────

export async function getAllBooks(format: DataFormat): Promise<Book[]> {
  const res = await axios.get(BASE_URL, {
    headers: { Accept: ACCEPT_HEADERS[format] },
    responseType: 'text',
    transformResponse: (data) => data, // prevent axios from auto-parsing JSON
  });
  return parseResponse(res.data, format);
}

export async function searchBooks(
  query: string,
  format: DataFormat,
  page = 1,
  limit = 50,
): Promise<Book[]> {
  const res = await axios.get(BASE_URL, {
    params: { q: query, page, limit },
    headers: { Accept: ACCEPT_HEADERS[format] },
    responseType: 'text',
    transformResponse: (data) => data,
  });
  return parseResponse(res.data, format);
}

export async function createBook(book: Omit<Book, 'id'>, format: DataFormat): Promise<void> {
  await axios.post(BASE_URL, serialise(book, format), {
    headers: { 'Content-Type': CONTENT_TYPES[format] },
  });
}

export async function updateBook(book: Book, format: DataFormat): Promise<void> {
  await axios.put(BASE_URL, serialise(book, format), {
    headers: { 'Content-Type': CONTENT_TYPES[format] },
  });
}

export async function deleteBook(id: number, format: DataFormat): Promise<void> {
  await axios.delete(BASE_URL, {
    data: serialise({ id }, format),
    headers: { 'Content-Type': CONTENT_TYPES[format] },
  });
}
