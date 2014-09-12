module.exports =

	dirPath: atom.getConfigDirPath()
	fileName: "scratch"

	activate: (state) ->
		atom.workspaceView.command "scratch:toggle", => @toggleScratch()

	toggleScratch: ->
		if @isScratchOpen()
			@closeScratch()
		else
			@openScratch()

	getScratchEditor: ->
		editors = atom.workspace.getEditors()
		for editor in editors
			return editor if editor.getTitle() is @fileName

	isScratchOpen: ->
		scratchEditor = @getScratchEditor()
		scratchEditor isnt undefined

	openScratch: ->
		atom.workspace.open(@dirPath + "/" + @fileName)

	closeScratch: ->
		scratchEditor = @getScratchEditor()
		if scratchEditor.shouldPromptToSave
			atom.workspace.getActivePane().promptToSaveItem(scratchEditor)
		scratchEditor.destroy()
