import JSZip from "jszip";
import sqlite3 from "better-sqlite3";

export class AnkiPackageBuilder {
  constructor(deckName) {
    this.zip = new JSZip();
    this.deckName = deckName;
    this.cards = [];
  }

  // Initialize SQLite database with required schema
  initializeDB() {
    const db = new sqlite3(":memory:");

    // Create necessary tables
    db.exec(`
      CREATE TABLE col (
        id integer PRIMARY KEY,
        crt integer,
        mod integer,
        scm integer,
        ver integer,
        dty integer,
        usn integer,
        ls integer,
        conf text,
        models text,
        decks text,
        dconf text,
        tags text
      );
  
      CREATE TABLE notes (
        id integer PRIMARY KEY AUTOINCREMENT,
        guid text,
        mid integer,
        mod integer,
        usn integer,
        tags text,
        flds text,
        sfld integer,
        csum integer,
        flags integer,
        data text
      );
  
      CREATE TABLE cards (
        id integer PRIMARY KEY,
        nid integer,
        did integer,
        ord integer,
        mod integer,
        usn integer,
        type integer,
        queue integer,
        due integer,
        ivl integer,
        factor integer,
        reps integer,
        lapses integer,
        left integer,
        odue integer,
        odid integer,
        flags integer,
        data text
      );
  
      CREATE TABLE revlog (
        id integer PRIMARY KEY,
        cid integer,
        usn integer,
        ease integer,
        ivl integer,
        lastIvl integer,
        factor integer,
        time integer,
        type integer
      );
  
      CREATE TABLE graves (
        usn integer,
        oid integer,
        type integer
      );
    `);

    return db;
  }

  // Add a card to the deck
  addCard(front, back) {
    this.cards.push({
      front,
      back,
      guid: Math.random().toString(36).substring(2),
    });
  }

  // Generate the package
  async generatePackage() {
    const db = this.initializeDB();
    const timestamp = Math.floor(Date.now() / 1000);

    // Deck configuration
    const deckConfig = {
      1: {
        id: 1,
        mod: timestamp,
        name: this.deckName,
        usn: -1,
        collapsed: false,
        newToday: [0, 0],
        revToday: [0, 0],
        lrnToday: [0, 0],
        timeToday: [0, 0],
        dyn: 0,
        extendNew: 0,
        extendRev: 0,
        conf: 1,
        browserCollapsed: false,
        desc: "",
      },
    };

    const deckConfigs = {
      1: {
        id: 1,
        mod: timestamp,
        name: "Default",
        usn: -1,
        maxTaken: 60,
        autoplay: true,
        timer: 0,
        replayq: true,
        new: {
          delays: [1, 10],
          separate: true,
          order: 1,
          initialFactor: 2500,
          bury: true,
        },
        rev: {
          perDay: 100,
          ease4: 1300,
          fuzz: 0.05,
          minSpace: 1,
          ivlFct: 1,
          maxIvl: 36500,
          bury: true,
        },
        lapse: {
          delays: [10],
          mult: 0,
          minIvl: 1,
          leechFails: 8,
          leechAction: 0,
        },
      },
    };

    // Model configuration
    const modelConfig = {
      1: {
        id: 1,
        name: "Basic",
        type: 0, // Model type, 0 for normal models
        mod: timestamp,
        usn: -1,
        sortf: 0,
        did: 1,
        flds: [
          {
            name: "Front",
            ord: 0,
            sticky: false,
            rtl: false, // Indicates Left-to-Right text
            font: "Arial", // Added font field
            size: 20, // You might also need to specify size
          },
          {
            name: "Back",
            ord: 1,
            sticky: false,
            rtl: false, // Indicates Left-to-Right text
            font: "Arial", // Added font field
            size: 20, // You might also need to specify size
          },
        ],
        tmpls: [
          {
            name: "Card 1",
            ord: 0,
            qfmt: "{{Front}}",
            afmt: '{{FrontSide}}<hr id="answer">{{Back}}',
          },
        ],
        css: `.card { 
          font-family: arial; 
          font-size: 20px; 
          text-align: center; 
          color: black; 
          background-color: white; 
        }`,
        sticky: false,
      },
    };

    // Insert metadata into col table
    db.prepare(
      `
      INSERT INTO col 
      (id, crt, mod, scm, ver, dty, usn, ls, conf, models, decks, dconf, tags)
      VALUES (1, ?, ?, ?, 11, 0, 0, 0, '{}', ?, ?, ?, '{}')
    `
    ).run(
      timestamp,
      timestamp,
      timestamp,
      JSON.stringify(modelConfig),
      JSON.stringify(deckConfig),
      JSON.stringify(deckConfigs)
    );

    // Insert cards and notes
    this.cards.forEach((card, index) => {
      const noteId = timestamp + index;
      const cardId = noteId;

      // Insert note
      db.prepare(
        `
        INSERT INTO notes 
        (id, guid, mid, mod, usn, tags, flds, sfld, csum, flags, data)
        VALUES (?, ?, 1, ?, -1, '', ?, 0, 0, 0, '')
      `
      ).run(noteId, card.guid, timestamp, `${card.front}\x1f${card.back}`);

      // Insert card
      db.prepare(
        `
        INSERT INTO cards 
        (id, nid, did, ord, mod, usn, type, queue, due, ivl, factor, reps, lapses, left, odue, odid, flags, data)
        VALUES (?, ?, 1, 0, ?, -1, 0, 0, ?, 0, 2500, 0, 0, 0, 0, 0, 0, '')
      `
      ).run(cardId, noteId, timestamp, index);
    });

    // Export database to buffer
    const dbBuffer = db.serialize();

    // Add files to zip
    this.zip.file("collection.anki2", dbBuffer);
    this.zip.file("media", "{}");

    // Generate zip file
    const zipBuffer = await this.zip.generateAsync({ type: "nodebuffer" });
    return zipBuffer;
  }
}
