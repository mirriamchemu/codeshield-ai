
import Editor from '@monaco-editor/react'

/**
 * Props accepted by the CodeEditor component.
 *
 * The parent component owns the source code state.
 */
interface CodeEditorProps {
    value: string
    onChange: (value: string) => void
}

function CodeEditor({ value, onChange }: CodeEditorProps) {
    return (
        <Editor
            height="450px"
            language="java"
            theme="vs-dark"
            value={value}
            onChange={(newValue) => onChange(newValue ?? '')}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                automaticLayout: true,
                scrollBeyondLastLine: false,
                tabSize: 4,
                wordWrap: 'on',
            }}
        />
    )
}

export default CodeEditor
