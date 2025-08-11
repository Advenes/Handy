/// <reference types="google.maps" />

import { MongoClient } from "mongodb";

declare global {
  // dodajemy do globalThis nową właściwość o typie Promise<MongoClient>
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export {};
