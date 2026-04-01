import promptSync from "prompt-sync";
import { IDocument } from "../document/IDocument";
import { DeleteCommand } from "../command/DeleteCommand";
import { InsertCommand } from "../command/InsertCommand";
import { OpenCommand } from "../command/OpenCommand";
import { ReplaceCommand } from "../command/ReplaceCommand";
import { StartCommand } from "../command/StartCommand";
import { UndoRedoManager } from "../command/UndoRedoManager";

export class TextEditor {
  private document: IDocument;
  private undoRedoManager: UndoRedoManager;
  private prompt;

  constructor(document: IDocument) {
    this.document = document;
    this.undoRedoManager = new UndoRedoManager();
    this.prompt = promptSync({ sigint: true });
  }

  run(): void {
    console.log("Simple Text Editor");
    console.log(
      "Commands: insert, delete, replace, display, save, open, start, undo, redo, quit",
    );

    let running = true;
    while (running) {
      const input = this.prompt("> ");
      const [command, ...args] = input.split(" ");

      try {
        switch (command) {
          case "insert": {
            const pos = parseInt(args[0], 10);
            const text = args.slice(1).join(" ");
            if (isNaN(pos) || !text) {
              console.log("Usage: insert <position> <text>");
              break;
            }
            const insertCommand = new InsertCommand(this.document, pos, text);
            this.undoRedoManager.execute(insertCommand);
            break;
          }
          case "delete": {
            const pos = parseInt(args[0], 10);
            const count = parseInt(args[1], 10);
            if (isNaN(pos) || isNaN(count)) {
              console.log("Usage: delete <position> <count>");
              break;
            }
            const deleteCommand = new DeleteCommand(this.document, pos, count);
            this.undoRedoManager.execute(deleteCommand);
            break;
          }
          case "replace": {
            const pos = parseInt(args[0], 10);
            const count = parseInt(args[1], 10);
            const text = args.slice(2).join(" ");
            if (isNaN(pos) || isNaN(count) || text === undefined) {
              console.log("Usage: replace <position> <count> <text>");
              break;
            }
            const replaceCommand = new ReplaceCommand(
              this.document,
              pos,
              count,
              text,
            );
            this.undoRedoManager.execute(replaceCommand);
            break;
          }
          case "display":
            console.log(this.document.getContents());
            break;
          case "save": {
            const fileName = args[0];
            if (!fileName) {
              console.log("Usage: save <filename>");
              break;
            }
            this.document.save(fileName);
            console.log(`Document saved to ${fileName}`);
            break;
          }
          case "open": {
            const fileName = args[0];
            if (!fileName) {
              console.log("Usage: open <filename>");
              break;
            }
            if (!this.document.fileExists(fileName)) {
              console.log("File does not exist.");
              break;
            }
            const openCommand = new OpenCommand(this.document, fileName);
            this.undoRedoManager.execute(openCommand);
            console.log(`Document opened from ${fileName}`);
            break;
          }
          case "start": {
            const startCommand = new StartCommand(this.document);
            this.undoRedoManager.execute(startCommand);
            console.log("New document started.");
            break;
          }
          case "undo":
            this.undoRedoManager.undo();
            break;
          case "redo":
            this.undoRedoManager.redo();
            break;
          case "quit":
            running = false;
            break;
          default:
            console.log(`Unknown command: ${command}`);
            break;
        }
      } catch (error) {
        console.error(
          `Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`,
        );
      }
    }
  }
}
