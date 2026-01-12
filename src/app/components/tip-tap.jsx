'use client'

import { Table, TableCell, TableHeader, TableRow } from '@tiptap/extension-table';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import './TipTap.css';
import { Pagination } from './pagination-extension';

const TipTap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Pagination.configure({
        pageHeight: 1056, // 11in * 96dpi
        margin: 96, // 1in * 96dpi
        contentHeight: 864, // 1056 - 96 - 96
      }),
    ],
    content: `
      <h1>Legal Document</h1>
      <p>This is a sample legal document to demonstrate the pagination features.</p>
      <p>Start typing to see how the content flows across pages. The editor simulates US Letter size pages with 1-inch margins.</p>
      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
    `,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
    immediatelyRender: false,
  })

  const exportToPDF = () => {
    if (!editor) return
    window.print()
  }

  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 pb-8">
      <div className="fixed top-4 right-4 z-10 print:hidden">
        <button 
          onClick={exportToPDF}
          className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition-colors"
        >
          Print / Save as PDF
        </button>
      </div>
      
      <div className="editor-container">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

export default TipTap
