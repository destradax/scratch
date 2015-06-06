module.exports =

	dirPath: atom.getConfigDirPath()
	fileName: "scratch"

	activate: (state) ->
		atom.commands.add "atom-workspace", "scratch:toggle", => @toggleScratch()

	toggleScratch: ->
		if @isScratchOpen()
			@closeScratch()
		else
			@openScratch()

	getScratchEditor: ->
		editors = atom.workspace.getTextEditors()
		for editor in editors
			return editor if editor.getTitle() is @fileName

	isScratchOpen: ->
		scratchEditor = @getScratchEditor()
		return scratchEditor?

	openScratch: ->
		atom.workspace.open(@dirPath + "/" + @fileName)

	closeScratch: ->
		scratchEditor = @getScratchEditor()
		if scratchEditor.shouldPromptToSave
			atom.workspace.getActivePane().promptToSaveItem(scratchEditor)
		scratchEditor.destroy()
