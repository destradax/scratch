"use babel";

import Scratch from "../lib/scratch";

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Scratch", () => {
	let workspaceElement, activationPromise;

	beforeEach(() => {
		workspaceElement = atom.views.getView(atom.workspace);
		activationPromise = atom.packages.activatePackage('scratch');
		atom.commands.dispatch(workspaceElement, 'scratch:toggle');

		waitsForPromise(() => {
			return activationPromise;
		});
	});

	describe("when the scratch:toggle event is triggered", () => {

		describe("and the scratch editor is not open", () => {

			beforeEach(() => {
				expect(Scratch.getScratchEditor()).toBeUndefined();
			});

			it("should open the scratch editor", () => {

				waitsForPromise(() => {
					return Scratch.openScratchEditor();
				});

				runs(() => {
					let scratchEditor = Scratch.getScratchEditor();
					expect(scratchEditor).not.toBeUndefined();

					let editorElement = atom.views.getView(scratchEditor);
					expect(atom.workspace.isTextEditor(scratchEditor)).toBe(true);
				});
			});
		});

	});
});
