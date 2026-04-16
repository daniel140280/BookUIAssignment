import type { Book, DataFormat } from '../../models/Book';

/*
This module provides functions to serialise Book objects into different formats (JSON, XML, plain text) for sending to the server.
*/

// JSON serialiser

function toJson(book: Partial<Book>): string {
  return JSON.stringify(book);
}

// XML serialiser

function toXml(book: Partial<Book>): string {
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

// Plain text serialiser

function toText(book: Partial<Book>): string {
  if (book.title === undefined) return String(book.id);
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

// Serialiser handler on entry point

export function serialise(book: Partial<Book>, format: DataFormat): string {
  switch (format) {
    case 'json': return toJson(book);
    case 'xml':  return toXml(book);
    case 'text': return toText(book);
  }
}