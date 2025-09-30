import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';
import 'tui-color-picker/dist/tui-color-picker.css';
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css';
import colorSyntax from '@toast-ui/editor-plugin-color-syntax';

type Props = {
  editorRef: React.RefObject<Editor | null>;
  imageHandler: (
    blob: File,
    callback: (url: string, altText: string) => void
  ) => void;
  content?: string;
};

const toolbar = [
  ['heading', 'bold', 'italic', 'strike'],
  ['hr', 'quote', 'ul', 'ol'],
  ['image'],
];

function TuiEditor({ content, editorRef, imageHandler }: Props) {
  return (
    <Editor
      initialValue={content}
      initialEditType="markdown"
      autofocus={false}
      ref={editorRef}
      toolbarItems={toolbar}
      hideModeSwitch
      height="700px"
      hooks={{ addImageBlobHook: imageHandler }}
      usageStatistics={false}
      plugins={[colorSyntax]}
    />
  );
}

export default TuiEditor;
