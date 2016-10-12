"use babel";

import { CompositeDisposable } from "atom";

export default {

	config: {
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
		return atom.config.get("scratch.path") + "/" + atom.config.get("scratch.filename");
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
			this.openScratchEditor();
		}
	},

	/**
	 * @description Opens the scratch editor.
	 */
	openScratchEditor() {
		let uri = this.getScratchURI();
		return atom.workspace.open(uri);
	},

	/**
	 * @description Closes the scratch editor.
	 */
	closeScratchEditor() {
		let scratchEditor = this.getScratchEditor();
		if (scratchEditor.shouldPromptToSave) {
			atom.workspace.getActivePane().promptToSaveItem(scratchEditor);
		}
		scratchEditor.destroy()
	}
}
