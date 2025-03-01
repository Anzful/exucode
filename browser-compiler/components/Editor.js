import { useState, useRef, useEffect } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { cpp } from '@codemirror/lang-cpp';
import { java } from '@codemirror/lang-java';
import axios from 'axios';

// Default code snippets for each language
const defaultCodes = {
  javascript: 'console.log("Hello, World!");',
  python: 'print("Hello, World!")',
  cpp: '#include <iostream>\n\nint main() {\n    std::cout << "Hello, World!" << std::endl;\n    return 0;\n}',
  java: 'public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
};

const Editor = () => {
  // State variables
  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState(defaultCodes.javascript);
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef(null);

  // Language extensions for CodeMirror
  const languageExtensions = {
    javascript: javascript(),
    python: python(),
    cpp: cpp(),
    java: java(),
  };

  // Reset code to default when language changes
  useEffect(() => {
    setCode(defaultCodes[language]);
  }, [language]);

  // Initialize CodeMirror editor
  useEffect(() => {
    if (editorRef.current) {
      const state = EditorState.create({
        doc: code,
        extensions: [
          basicSetup, // Includes line numbers and syntax highlighting
          languageExtensions[language],
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              setCode(update.state.doc.toString());
            }
          }),
        ],
      });

      const view = new EditorView({
        state,
        parent: editorRef.current,
      });

      // Cleanup on unmount or language change
      return () => view.destroy();
    }
  }, [language]);

  // Handle language selection
  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Handle code execution
  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Running...');
    try {
      const response = await axios.post('/api/execute', { language, code });
      setOutput(response.data.output);
    } catch (error) {
      setOutput('Error: ' + error.message);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header with language dropdown and Run button */}
      <div className="flex justify-between p-4">
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-gray-800 p-2 rounded"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <button
          onClick={handleRun}
          className={`bg-blue-500 p-2 rounded ${isRunning ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isRunning}
        >
          {isRunning ? 'Running...' : 'Run'}
        </button>
      </div>
      {/* Split-screen layout */}
      <div className="flex flex-1">
        {/* Code Editor */}
        <div className="w-1/2 p-4 border-r border-gray-700">
          <div ref={editorRef} className="h-full" />
        </div>
        {/* Output Console */}
        <div className="w-1/2 p-4 bg-gray-800 overflow-auto">
          <pre className="text-white">{output}</pre>
        </div>
      </div>
    </div>
  );
};

export default Editor;