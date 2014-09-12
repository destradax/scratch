{WorkspaceView} = require 'atom'
Scratch = require '../lib/scratch'

# Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
#
# To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
# or `fdescribe`). Remove the `f` to unfocus the block.

describe "Scratch", ->
	activationPromise = null

	beforeEach ->
		atom.workspaceView = new WorkspaceView
		activationPromise = atom.packages.activatePackage('scratch')

	describe "when the scratch:toggle event is triggered", ->
		it "opens and then closes the scratch", ->
