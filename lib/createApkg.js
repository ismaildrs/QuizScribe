import { AnkiPackageBuilder } from "./AnkiPackageBuilder.js";

export async function exportApkgFile(deckName, flashcards) {
  const apkg = new AnkiPackageBuilder(deckName);
  try {
    flashcards.forEach((flashcard) => {
      apkg.addCard(flashcard["question"], flashcard["answer"]);
    });

    const outputZip = await apkg.generatePackage("./output.apkg");
    return outputZip;
  } catch (e) {
    console.error("Error: " + e);
  }
}
