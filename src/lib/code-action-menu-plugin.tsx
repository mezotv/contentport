/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type { JSX } from "react"

import {
  $createCodeNode,
  $isCodeNode,
  CodeNode,
  getLanguageFriendlyName,
  normalizeCodeLang,
} from "@lexical/code"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import {
  $getNearestNodeFromDOMNode,
  $getSelection,
  $isRangeSelection,
  isHTMLElement,
  LexicalEditor,
} from "lexical"
import { useEffect, useRef, useState } from "react"
import * as React from "react"
import { createPortal } from "react-dom"
import { useDebounce } from "./use-debounce"
import { $setBlocksType } from "@lexical/selection"

// import {CopyButton} from './components/CopyButton';
// import {canBePrettier, PrettierButton} from './components/PrettierButton';

export const formatCode = (editor: LexicalEditor, blockType: string) => {
  if (blockType !== "code") {
    editor.update(() => {
      let selection = $getSelection()
      if (!selection) {
        return
      }
      if (!$isRangeSelection(selection) || selection.isCollapsed()) {
        $setBlocksType(selection, () => $createCodeNode())
      } else {
        const textContent = selection.getTextContent()
        const codeNode = $createCodeNode()
        selection.insertNodes([codeNode])
        selection = $getSelection()
        if ($isRangeSelection(selection)) {
          selection.insertRawText(textContent)
        }
      }
    })
  }
}

const CODE_PADDING = 8

interface Position {
  top: string
  right: string
}

function CodeActionMenuContainer({
  anchorElem,
}: {
  anchorElem: HTMLElement
}): JSX.Element {
  const [editor] = useLexicalComposerContext()

  const [lang, setLang] = useState("")
  const [isShown, setShown] = useState<boolean>(false)
  const [shouldListenMouseMove, setShouldListenMouseMove] =
    useState<boolean>(false)
  const [position, setPosition] = useState<Position>({
    right: "0",
    top: "0",
  })
  const codeSetRef = useRef<Set<string>>(new Set())
  const codeDOMNodeRef = useRef<HTMLElement | null>(null)

  const debouncedOnMouseMove = useDebounce((event: MouseEvent) => {
    const { codeDOMNode, isOutside } = getMouseInfo(event)
    if (isOutside) {
      setShown(false)
      return
    }

    if (!codeDOMNode) {
      return
    }

    codeDOMNodeRef.current = codeDOMNode

    let codeNode: CodeNode | null = null
    let _lang = ""

    editor.update(() => {
      const maybeCodeNode = $getNearestNodeFromDOMNode(codeDOMNode)

      if ($isCodeNode(maybeCodeNode)) {
        codeNode = maybeCodeNode
        _lang = codeNode.getLanguage() || ""
      }
    })

    if (codeNode) {
      const { y: editorElemY, right: editorElemRight } =
        anchorElem.getBoundingClientRect()
      const { y, right } = codeDOMNode.getBoundingClientRect()
      setLang(_lang)
      setShown(true)
      setPosition({
        right: `${editorElemRight - right + CODE_PADDING}px`,
        top: `${y - editorElemY}px`,
      })
    }
  }, 1000)

  useEffect(() => {
    if (!shouldListenMouseMove) {
      return
    }

    document.addEventListener("mousemove", debouncedOnMouseMove)

    return () => {
      setShown(false)
      debouncedOnMouseMove.cancel()
      document.removeEventListener("mousemove", debouncedOnMouseMove)
    }
  }, [shouldListenMouseMove, debouncedOnMouseMove])

  useEffect(() => {
    return editor.registerMutationListener(
      CodeNode,
      (mutations) => {
        editor.getEditorState().read(() => {
          for (const [key, type] of mutations) {
            switch (type) {
              case "created":
                codeSetRef.current.add(key)
                break

              case "destroyed":
                codeSetRef.current.delete(key)
                break

              default:
                break
            }
          }
        })
        setShouldListenMouseMove(codeSetRef.current.size > 0)
      },
      { skipInitialization: false }
    )
  }, [editor])

  const normalizedLang = normalizeCodeLang(lang)
  const codeFriendlyName = getLanguageFriendlyName(lang)

  return (
    <>
      {true ? (
        <div className="code-action-menu-container" style={{ ...position }}>
          <div className="code-highlight-language">{codeFriendlyName}asd</div>
          <p>bigass button</p>
        </div>
      ) : null}
    </>
  )
}

function getMouseInfo(event: MouseEvent): {
  codeDOMNode: HTMLElement | null
  isOutside: boolean
} {
  const target = event.target

  if (isHTMLElement(target)) {
    const codeDOMNode = target.closest<HTMLElement>(
      "code.PlaygroundEditorTheme__code"
    )
    const isOutside = !(
      codeDOMNode ||
      target.closest<HTMLElement>("div.code-action-menu-container")
    )

    return { codeDOMNode, isOutside }
  } else {
    return { codeDOMNode: null, isOutside: true }
  }
}

export default function CodeActionMenuPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement
}): React.ReactPortal | null {
  return createPortal(
    <CodeActionMenuContainer anchorElem={anchorElem} />,
    anchorElem
  )
}
