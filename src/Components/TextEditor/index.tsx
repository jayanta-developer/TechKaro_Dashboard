import {
  forwardRef,
  useEffect,
  useLayoutEffect,
  useRef,
  MutableRefObject,
} from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './style.css';

// 🟡 Define missing types manually
type DeltaStatic = ReturnType<Quill['getContents']>;
type Sources = 'api' | 'user' | 'silent';
type RangeStatic = { index: number; length: number };

type EditorProps = {
  readOnly?: boolean;
  defaultValue?: DeltaStatic;
  state?: string; // controlled HTML value
  setState?: (html: string) => void; // setter for HTML
  onTextChange?: (
    delta: DeltaStatic,
    oldDelta: DeltaStatic,
    source: Sources
  ) => void;
  onSelectionChange?: (
    range: RangeStatic | null,
    oldRange: RangeStatic | null,
    source: Sources
  ) => void;
};

const Editor = forwardRef<Quill | null, EditorProps>(
  (
    {
      readOnly = false,
      defaultValue,
      state,
      setState,
      onTextChange,
      onSelectionChange,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);

    useLayoutEffect(() => {
      onTextChangeRef.current = onTextChange;
      onSelectionChangeRef.current = onSelectionChange;
    }, [onTextChange, onSelectionChange]);

    // 🟢 Dynamically update readOnly mode
    useEffect(() => {
      if (ref && typeof ref !== 'function') {
        (ref.current as Quill | null)?.enable?.(!readOnly);
      }
    }, [readOnly, ref]);

    // 🟢 Initialize Quill editor
    useEffect(() => {
      const container = containerRef.current;
      if (!container) return;

      const quill = new Quill(container, {
        theme: 'snow',
        readOnly,
      });

      // 🟢 Forward Quill instance
      if (ref && typeof ref !== 'function') {
        (ref as MutableRefObject<Quill | null>).current = quill;
      }

      // 🟢 Set default or controlled value
      if (defaultValue) {
        quill.setContents(defaultValue);
      } else if (state) {
        quill.root.innerHTML = state;
      }

      quill.on('text-change', (...args) => {
        onTextChangeRef.current?.(...args);
        if (setState) {
          setState(quill.root.innerHTML);
        }
      });

      quill.on('selection-change', (...args) => {
        onSelectionChangeRef.current?.(...args);
      });

      return () => {
        if (ref && typeof ref !== 'function') {
          (ref as MutableRefObject<Quill | null>).current = null;
        }
        container.innerHTML = '';
      };
    }, []);

    // 🟢 External value changes sync
    useEffect(() => {
      if (ref && typeof ref !== 'function' && state) {
        const quill = ref.current;
        if (quill && quill.root.innerHTML !== state) {
          const selection = quill.getSelection();
          quill.root.innerHTML = state;
          if (selection) quill.setSelection(selection);
        }
      }
    }, [state, ref]);

    return <div ref={containerRef} />;
  }
);

Editor.displayName = 'Editor';
export default Editor;
