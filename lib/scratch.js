"use babel";

import {CompositeDisposable} from "atom";
import fs from "fs";
import path from "path";

export default {
	config: {
		autosave: {
			title: "Autosave the scratch file on close",
			description: "Whether the scratch file should be automatically saved when it's closed",
			type: "boolean",
			default: false
		},
		pinned: {
			title: "Pin to the left",
			description: "The scratch file always opens pinned to the left of the active pane",
			type: "boolean",
			default: false
		},
		filename: {
			title: "Scratch file name",
			description: "The default name for the scratch file",
			type: "string",
			default: "scratch"
		},
		path: {
			title: "Path of the scratch file",
			description: "The path where the scratch file will be saved",
			type: "string",
			default: atom.getConfigDirPath()
		}
	},

	suscriptions: null,

	activate(state) {
		// Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
		this.subscriptions = new CompositeDisposable();

		// Register command that toggles this view
		this.subscriptions.add(atom.commands.add("atom-workspace", {
			"scratch:toggle": () => this.toggleScratch()
		}));
	},

	deactivate() {
		this.subscriptions.dispose();
	},

	/**
	 * @description Builds the URI of the scratch editor in the system, based on the current configuration.
	 * @return {string} The URI of the scratch editor.
	 */
	getScratchURI() {
		const scratchPath = atom.config.get("scratch.path");
		if (fs.existsSync(scratchPath)) {
			if (!fs.statSync(scratchPath).isDirectory()) {
				atom.notifications.addWarning(`Scratch has an invalid path set: '${scratchPath}' is not a directory`);
				return;
			}
		}

		const scratchFilename = atom.config.get("scratch.filename");
		return path.join(scratchPath, scratchFilename);
	},

	/**
	 * @description Loops through all of the currently open text editors to see if any of them is the scratch editor.
	 * If the scratch editor is open multiple times (like split views), only the first instance will be returned.
	 * @return {object} the scratch editor if it is open, null otherwise.
	 */
	getScratchEditor() {
		return atom.workspace.getTextEditors().find(function (editor) {
			return editor.getTitle() === "scratch";
		});
	},

	/**
	 * @description Opens the scratch editor. If it is already open, closes it.
	 */
	toggleScratch() {
		let scratchEditor = this.getScratchEditor();
		if (scratchEditor) {
			this.closeScratchEditor();
		} else {
			this.openScratchEditor(atom.config.get("scratch.pinned"));
		}
	},

	/**
	 * @description Opens the scratch editor.
	 */
	openScratchEditor(pinned = false) {
		const uri = this.getScratchURI();

		if (uri) {
			return atom.workspace.open(uri)
			.then((scratchEditor) => {
				if (pinned) {
					const activePane = atom.workspace.getActivePane();
					activePane.moveItem(scratchEditor, 0);
				}
			});
		}
	},

	/**
	 * @description Closes the scratch editor.
	 */
	closeScratchEditor() {
		let scratchEditor = this.getScratchEditor();
		if (atom.config.get("scratch.autosave")) {
			scratchEditor.save();
			scratchEditor.destroy();
		} else {
			atom.workspace.getActivePane().destroyItem(scratchEditor, false);
		}
	}
}
