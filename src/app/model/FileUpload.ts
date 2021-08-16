import { NgxFileDropEntry } from "ngx-file-drop";
import { FileSystemEntry } from "ngx-file-drop/ngx-file-drop/dom.types";

/**
 * fileEntry is an instance of {@link FileSystemFileEntry} or {@link FileSystemDirectoryEntry}.
 * Which one is it can be checked using {@link FileSystemEntry.isFile} or {@link FileSystemEntry.isDirectory}
 * properties of the given {@link FileSystemEntry}.
 */
export declare class NgxFileDropEntryAikyne extends NgxFileDropEntry {
    progressStatus: string;
    progressPercentage: string;
    fileKey: string;
}
