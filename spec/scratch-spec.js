"use babel";

import Scratch from "../lib/scratch";

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe("Scratch", () => {

	beforeEach(() => {
		let workspaceElement;

		let activationPromise = atom.packages.activatePackage('scratch');
		workspaceElement = atom.views.getView(atom.workspace);
		atom.commands.dispatch(workspaceElement, 'scratch:toggle');

		waitsForPromise(() => {
			return activationPromise;
		});

		runs(() => {
			expect(atom.packages.isPackageActive("scratch")).toBe(true);
		});
	});

	describe("when the scratch package is loaded for the first time", () => {

		it("should have the default filename and path", () => {
			expect(atom.config.get("scratch.filename")).toBe("scratch");
			expect(atom.config.get("scratch.path")).toBe(atom.getConfigDirPath());

			let defaultUri = `${atom.getConfigDirPath()}/scratch`;

			expect(Scratch.getScratchURI()).toBe(defaultUri);
		});
	});

	describe("when the scratch:toggle event is triggered", () => {

		describe("and the scratch editor is not open", () => {

			beforeEach(() => {
				while (Scratch.getScratchEditor()) {
					Scratch.closeScratchEditor();
				}
				expect(Scratch.getScratchEditor()).toBeUndefined();
			});

			it("should open the scratch editor", () => {
				waitsForPromise(() => {
					return Scratch.openScratchEditor();
				});

				runs(() => {
					let scratchEditor = Scratch.getScratchEditor();
					expect(scratchEditor).not.toBeUndefined();

					expect(atom.workspace.isTextEditor(scratchEditor)).toBe(true);
				});
			});
		});

		describe("and the scratch editor is open", () => {

			beforeEach(() => {
				if (!Scratch.getScratchEditor()) {
					waitsForPromise(() => {
						return Scratch.openScratchEditor();
					});
				}
			});

			it("should close the scratch editor", () => {
				Scratch.closeScratchEditor();
				expect(Scratch.getScratchEditor()).toBeUndefined();
			});
		});

	});
});
