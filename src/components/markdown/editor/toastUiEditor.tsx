import { Editor } from '@toast-ui/react-editor';
import '@toast-ui/editor/toastui-editor.css';

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
      initialValue={content ?? ' '}
      initialEditType="markdown"
      autofocus={false}
      ref={editorRef}
      toolbarItems={toolbar}
      hideModeSwitch
      height="700px"
      hooks={{ addImageBlobHook: imageHandler }}
      usageStatistics={false}
      customHTMLSanitizer={(html: any) => {
        // <br> 태그를 허용
        return html;
      }}
      markdown={{
        breaks: true,
      }}
      customHTMLRenderer={{
        htmlInline: {
          big(node: any) {
            return [
              { type: 'openTag', tagName: 'big', outerNewLine: true },
              { type: 'html', content: node.literal },
              { type: 'closeTag', tagName: 'big', outerNewLine: true },
            ];
          },
        },
        htmlBlock: {
          iframe(node: any) {
            return [
              {
                type: 'openTag',
                tagName: 'iframe',
                outerNewLine: true,
                attributes: node.attrs,
              },
              { type: 'html', content: node.childrenHTML },
              { type: 'closeTag', tagName: 'iframe', outerNewLine: true },
            ];
          },
        },
      }}
      viewer={false} 
    />
  );
}

export default TuiEditor;
