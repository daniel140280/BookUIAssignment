import type { Book, DataFormat } from '../../models/Book';

/*
This module provides functions to deserialise data from different formats (JSON, XML, plain text) into Book objects received from the server.
*/

// JSON deserialiser

function fromJson(data: string): Book[] {
  const parsed = JSON.parse(data);
  return Array.isArray(parsed) ? parsed : [parsed];
}

// XML deserialiser

function fromXml(data: string): Book[] {
  const parser = new DOMParser();
  const doc    = parser.parseFromString(data, 'application/xml');
  const nodes  = doc.querySelectorAll('books > book');

  return Array.from(nodes).map((node) => ({
    id:         parseInt(node.querySelector('id')?.textContent         ?? '0', 10),
    title:      node.querySelector('title')?.textContent               ?? '',
    author:     node.querySelector('author')?.textContent              ?? '',
    date:       node.querySelector('date')?.textContent                ?? '',
    genres:     node.querySelector('genres')?.textContent              ?? '',
    characters: node.querySelector('characters')?.textContent          ?? '',
    synopsis:   node.querySelector('synopsis')?.textContent            ?? '',
  }));
}

// Plain text deserialiser - each line will be a book record with fields separated by '##'

function fromText(data: string): Book[] {
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

// Deserialiser handler on entry point

export function deserialise(data: string, format: DataFormat): Book[] {
  switch (format) {
    case 'json': return fromJson(data);
    case 'xml':  return fromXml(data);
    case 'text': return fromText(data);
  }
}