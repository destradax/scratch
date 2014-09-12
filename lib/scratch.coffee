module.exports =

	dirPath: atom.getConfigDirPath()
	fileName: "scratch"

	activate: (state) ->
		atom.workspaceView.command "scratch:toggle", => @toggleScratch()

	toggleScratch: ->
		if @isScratchOpen()
			@closeScratch()
		else
			atom.workspace.open(@dirPath + "/" + @fileName)

	isScratchOpen: ->
		editors = atom.workspace.getEditors()
		for editor in editors
			return true if editor.getTitle() is @fileName
		return false

	closeScratch: ->
		editors = atom.workspace.getEditors()
		scratch = null
		for editor in editors
			do (editor) ->
				if editor.getTitle() is @fileName
					scratch = editor
		if scratch && scratch.shouldPromptToSave
			atom.workspace.getActivePane().promptToSaveItem(scratch)
		editor.destroy()
