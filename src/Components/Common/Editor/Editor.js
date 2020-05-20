import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic";
import Underline from "@ckeditor/ckeditor5-basic-styles/src/underline";
import Strikethrough from "@ckeditor/ckeditor5-basic-styles/src/strikethrough";
import BlockQuote from "@ckeditor/ckeditor5-block-quote/src/blockquote";
import Link from "@ckeditor/ckeditor5-link/src/link";
import MediaEmbed from "@ckeditor/ckeditor5-media-embed/src/mediaembed";
import PasteFromOffice from "@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice";
import Heading from "@ckeditor/ckeditor5-heading/src/heading";
import Font from "@ckeditor/ckeditor5-font/src/font";
import FontFamilyEditing from "@ckeditor/ckeditor5-font/src/fontfamily/fontfamilyediting";
import Image from "@ckeditor/ckeditor5-image/src/image";
import ImageStyle from "@ckeditor/ckeditor5-image/src/imagestyle";
import ImageToolbar from "@ckeditor/ckeditor5-image/src/imagetoolbar";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload";
import ImageResize from "@ckeditor/ckeditor5-image/src/imageresize";
import ImageCaption from "@ckeditor/ckeditor5-image/src/imagecaption";
import List from "@ckeditor/ckeditor5-list/src/list";
import Alignment from "@ckeditor/ckeditor5-alignment/src/alignment";
import Table from "@ckeditor/ckeditor5-table/src/table";
import TableToolbar from "@ckeditor/ckeditor5-table/src/tabletoolbar";
import TextTransformation from "@ckeditor/ckeditor5-typing/src/texttransformation";
import Indent from "@ckeditor/ckeditor5-indent/src/indent";
import IndentBlock from "@ckeditor/ckeditor5-indent/src/indentblock";
import Base64UploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/base64uploadadapter";
import HorizontalLine from "@ckeditor/ckeditor5-horizontal-line/src/horizontalline";

import "./Editor.scss";

const colorArray = [
  { color: "hsl(6, 54%, 95%)", label: " " },
  { color: "hsl(6, 54%, 89%)", label: " " },
  { color: "hsl(6, 54%, 78%)", label: " " },
  { color: "hsl(6, 54%, 68%)", label: " " },
  { color: "hsl(6, 54%, 57%)", label: " " },
  { color: "hsl(6, 63%, 46%)", label: " " },
  { color: "hsl(6, 63%, 41%)", label: " " },
  { color: "hsl(6, 63%, 35%)", label: " " },
  { color: "hsl(6, 63%, 29%)", label: " " },
  { color: "hsl(6, 63%, 24%)", label: " " },
  { color: "hsl(6, 78%, 96%)", label: " " },
  { color: "hsl(6, 78%, 91%)", label: " " },
  { color: "hsl(6, 78%, 83%)", label: " " },
  { color: "hsl(6, 78%, 74%)", label: " " },
  { color: "hsl(6, 78%, 66%)", label: " " },
  { color: "hsl(6, 78%, 57%)", label: " " },
  { color: "hsl(6, 59%, 50%)", label: " " },
  { color: "hsl(6, 59%, 43%)", label: " " },
  { color: "hsl(6, 59%, 37%)", label: " " },
  { color: "hsl(6, 59%, 30%)", label: " " },
  { color: "hsl(283, 39%, 95%)", label: " " },
  { color: "hsl(283, 39%, 91%)", label: " " },
  { color: "hsl(283, 39%, 81%)", label: " " },
  { color: "hsl(283, 39%, 72%)", label: " " },
  { color: "hsl(283, 39%, 63%)", label: " " },
  { color: "hsl(283, 39%, 53%)", label: " " },
  { color: "hsl(283, 34%, 47%)", label: " " },
  { color: "hsl(283, 34%, 40%)", label: " " },
  { color: "hsl(283, 34%, 34%)", label: " " },
  { color: "hsl(283, 34%, 28%)", label: " " },
  { color: "hsl(282, 39%, 95%)", label: " " },
  { color: "hsl(282, 39%, 89%)", label: " " },
  { color: "hsl(282, 39%, 79%)", label: " " },
  { color: "hsl(282, 39%, 68%)", label: " " },
  { color: "hsl(282, 39%, 58%)", label: " " },
  { color: "hsl(282, 44%, 47%)", label: " " },
  { color: "hsl(282, 44%, 42%)", label: " " },
  { color: "hsl(282, 44%, 36%)", label: " " },
  { color: "hsl(282, 44%, 30%)", label: " " },
  { color: "hsl(282, 44%, 25%)", label: " " },
  { color: "hsl(204, 51%, 94%)", label: " " },
  { color: "hsl(204, 51%, 89%)", label: " " },
  { color: "hsl(204, 51%, 78%)", label: " " },
  { color: "hsl(204, 51%, 67%)", label: " " },
  { color: "hsl(204, 51%, 55%)", label: " " },
  { color: "hsl(204, 64%, 44%)", label: " " },
  { color: "hsl(204, 64%, 39%)", label: " " },
  { color: "hsl(204, 64%, 34%)", label: " " },
  { color: "hsl(204, 64%, 28%)", label: " " },
  { color: "hsl(204, 64%, 23%)", label: " " },
  { color: "hsl(204, 70%, 95%)", label: " " },
  { color: "hsl(204, 70%, 91%)", label: " " },
  { color: "hsl(204, 70%, 81%)", label: " " },
  { color: "hsl(204, 70%, 72%)", label: " " },
  { color: "hsl(204, 70%, 63%)", label: " " },
  { color: "hsl(204, 70%, 53%)", label: " " },
  { color: "hsl(204, 62%, 47%)", label: " " },
  { color: "hsl(204, 62%, 40%)", label: " " },
  { color: "hsl(204, 62%, 34%)", label: " " },
  { color: "hsl(204, 62%, 28%)", label: " " },
  { color: "hsl(168, 55%, 94%)", label: " " },
  { color: "hsl(168, 55%, 88%)", label: " " },
  { color: "hsl(168, 55%, 77%)", label: " " },
  { color: "hsl(168, 55%, 65%)", label: " " },
  { color: "hsl(168, 55%, 54%)", label: " " },
  { color: "hsl(168, 76%, 42%)", label: " " },
  { color: "hsl(168, 76%, 37%)", label: " " },
  { color: "hsl(168, 76%, 32%)", label: " " },
  { color: "hsl(168, 76%, 27%)", label: " " },
  { color: "hsl(168, 76%, 22%)", label: " " },
  { color: "hsl(168, 42%, 94%)", label: " " },
  { color: "hsl(168, 42%, 87%)", label: " " },
  { color: "hsl(168, 42%, 74%)", label: " " },
  { color: "hsl(168, 42%, 61%)", label: " " },
  { color: "hsl(168, 45%, 49%)", label: " " },
  { color: "hsl(168, 76%, 36%)", label: " " },
  { color: "hsl(168, 76%, 31%)", label: " " },
  { color: "hsl(168, 76%, 27%)", label: " " },
  { color: "hsl(168, 76%, 23%)", label: " " },
  { color: "hsl(168, 76%, 19%)", label: " " },
  { color: "hsl(145, 45%, 94%)", label: " " },
  { color: "hsl(145, 45%, 88%)", label: " " },
  { color: "hsl(145, 45%, 77%)", label: " " },
  { color: "hsl(145, 45%, 65%)", label: " " },
  { color: "hsl(145, 45%, 53%)", label: " " },
  { color: "hsl(145, 63%, 42%)", label: " " },
  { color: "hsl(145, 63%, 37%)", label: " " },
  { color: "hsl(145, 63%, 32%)", label: " " },
  { color: "hsl(145, 63%, 27%)", label: " " },
  { color: "hsl(145, 63%, 22%)", label: " " },
  { color: "hsl(145, 61%, 95%)", label: " " },
  { color: "hsl(145, 61%, 90%)", label: " " },
  { color: "hsl(145, 61%, 80%)", label: " " },
  { color: "hsl(145, 61%, 69%)", label: " " },
  { color: "hsl(145, 61%, 59%)", label: " " },
  { color: "hsl(145, 63%, 49%)", label: " " },
  { color: "hsl(145, 63%, 43%)", label: " " },
  { color: "hsl(145, 63%, 37%)", label: " " },
  { color: "hsl(145, 63%, 31%)", label: " " },
  { color: "hsl(145, 63%, 25%)", label: " " },
  { color: "hsl(48, 89%, 95%)", label: " " },
  { color: "hsl(48, 89%, 90%)", label: " " },
  { color: "hsl(48, 89%, 80%)", label: " " },
  { color: "hsl(48, 89%, 70%)", label: " " },
  { color: "hsl(48, 89%, 60%)", label: " " },
  { color: "hsl(48, 89%, 50%)", label: " " },
  { color: "hsl(48, 88%, 44%)", label: " " },
  { color: "hsl(48, 88%, 38%)", label: " " },
  { color: "hsl(48, 88%, 32%)", label: " " },
  { color: "hsl(48, 88%, 26%)", label: " " },
  { color: "hsl(37, 90%, 95%)", label: " " },
  { color: "hsl(37, 90%, 90%)", label: " " },
  { color: "hsl(37, 90%, 80%)", label: " " },
  { color: "hsl(37, 90%, 71%)", label: " " },
  { color: "hsl(37, 90%, 61%)", label: " " },
  { color: "hsl(37, 90%, 51%)", label: " " },
  { color: "hsl(37, 86%, 45%)", label: " " },
  { color: "hsl(37, 86%, 39%)", label: " " },
  { color: "hsl(37, 86%, 33%)", label: " " },
  { color: "hsl(37, 86%, 27%)", label: " " },
  { color: "hsl(28, 80%, 95%)", label: " " },
  { color: "hsl(28, 80%, 90%)", label: " " },
  { color: "hsl(28, 80%, 81%)", label: " " },
  { color: "hsl(28, 80%, 71%)", label: " " },
  { color: "hsl(28, 80%, 61%)", label: " " },
  { color: "hsl(28, 80%, 52%)", label: " " },
  { color: "hsl(28, 74%, 46%)", label: " " },
  { color: "hsl(28, 74%, 39%)", label: " " },
  { color: "hsl(28, 74%, 33%)", label: " " },
  { color: "hsl(28, 74%, 27%)", label: " " },
  { color: "hsl(24, 71%, 94%)", label: " " },
  { color: "hsl(24, 71%, 88%)", label: " " },
  { color: "hsl(24, 71%, 77%)", label: " " },
  { color: "hsl(24, 71%, 65%)", label: " " },
  { color: "hsl(24, 71%, 53%)", label: " " },
  { color: "hsl(24, 100%, 41%)", label: " " },
  { color: "hsl(24, 100%, 36%)", label: " " },
  { color: "hsl(24, 100%, 31%)", label: " " },
  { color: "hsl(24, 100%, 26%)", label: " " },
  { color: "hsl(24, 100%, 22%)", label: " " },
  { color: "hsl(192, 15%, 99%)", label: " " },
  { color: "hsl(192, 15%, 99%)", label: " " },
  { color: "hsl(192, 15%, 97%)", label: " " },
  { color: "hsl(192, 15%, 96%)", label: " " },
  { color: "hsl(192, 15%, 95%)", label: " " },
  { color: "hsl(192, 15%, 94%)", label: " " },
  { color: "hsl(192, 5%, 82%)", label: " " },
  { color: "hsl(192, 3%, 71%)", label: " " },
  { color: "hsl(192, 2%, 60%)", label: " " },
  { color: "hsl(192, 1%, 49%)", label: " " },
  { color: "hsl(204, 8%, 98%)", label: " " },
  { color: "hsl(204, 8%, 95%)", label: " " },
  { color: "hsl(204, 8%, 90%)", label: " " },
  { color: "hsl(204, 8%, 86%)", label: " " },
  { color: "hsl(204, 8%, 81%)", label: " " },
  { color: "hsl(204, 8%, 76%)", label: " " },
  { color: "hsl(204, 5%, 67%)", label: " " },
  { color: "hsl(204, 4%, 58%)", label: " " },
  { color: "hsl(204, 3%, 49%)", label: " " },
  { color: "hsl(204, 3%, 40%)", label: " " },
  { color: "hsl(210, 12%, 93%)", label: " " },
  { color: "hsl(210, 12%, 86%)", label: " " },
  { color: "hsl(210, 12%, 71%)", label: " " },
  { color: "hsl(210, 12%, 57%)", label: " " },
  { color: "hsl(210, 15%, 43%)", label: " " },
  { color: "hsl(210, 29%, 29%)", label: " " },
  { color: "hsl(210, 29%, 25%)", label: " " },
  { color: "hsl(210, 29%, 22%)", label: " " },
  { color: "hsl(210, 29%, 18%)", label: " " },
  { color: "hsl(210, 29%, 15%)", label: " " },
  { color: "hsl(210, 9%, 92%)", label: " " },
  { color: "hsl(210, 9%, 85%)", label: " " },
  { color: "hsl(210, 9%, 70%)", label: " " },
  { color: "hsl(210, 9%, 55%)", label: " " },
  { color: "hsl(210, 14%, 39%)", label: " " },
  { color: "hsl(210, 29%, 24%)", label: " " },
  { color: "hsl(210, 29%, 21%)", label: " " },
  { color: "hsl(210, 29%, 18%)", label: " " },
  { color: "hsl(210, 29%, 16%)", label: " " },
  { color: "hsl(210, 29%, 13%)", label: " " },
];

class Editor extends React.Component {
  onEditorChange = (event, editor) => {
    // 부모 컴포넌트로 데이터 전송
    this.props.getData(editor.getData());
  };

  render() {
    return (
      <div>
        <CKEditor
          data=""
          onChange={this.onEditorChange}
          config={{
            plugins: [
              Essentials,
              Paragraph,
              Bold,
              Italic,
              Heading,
              Indent,
              IndentBlock,
              Underline,
              Strikethrough,
              BlockQuote,
              Font,
              FontFamilyEditing,
              Alignment,
              List,
              Link,
              MediaEmbed,
              PasteFromOffice,
              Image,
              ImageStyle,
              ImageToolbar,
              ImageUpload,
              ImageResize,
              ImageCaption,
              Base64UploadAdapter,
              Table,
              TableToolbar,
              TextTransformation,
              HorizontalLine,
            ],
            toolbar: [
              "heading",
              "|",
              "bold",
              "italic",
              "underline",
              "strikethrough",
              "|",
              "fontFamily",
              "fontSize",
              "fontColor",
              "fontBackgroundColor",
              "|",
              "alignment",
              "outdent",
              "indent",
              "bulletedList",
              "numberedList",
              "blockQuote",
              "horizontalLine",
              "|",
              "link",
              "insertTable",
              "imageUpload",
              "mediaEmbed",
              "|",
              "undo",
              "redo",
            ],
            heading: {
              options: [
                {
                  model: "paragraph",
                  view: "p",
                  title: "본문",
                  class: "ck-heading_paragraph",
                },
                {
                  model: "heading1",
                  view: "h1",
                  title: "헤더1",
                  class: "ck-heading_heading1",
                },
                {
                  model: "heading2",
                  view: "h2",
                  title: "헤더2",
                  class: "ck-heading_heading2",
                },
                {
                  model: "heading3",
                  view: "h3",
                  title: "헤더3",
                  class: "ck-heading_heading3",
                },
              ],
            },
            fontFamily: {
              options: [
                "NanumSquare",
                "Spoqa Han Sans",
                "Noto Sans KR",
                "Open Sans",
                "Gothicssi",
                "SoftGothicssi",
              ],
            },
            fontSize: {
              options: [11, 13, 14, 15, 16, 19, 24, 28, 30, 34, 38],
            },
            alignment: {
              options: ["justify", "left", "center", "right"],
            },
            table: {
              contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
            },
            image: {
              resizeUnit: "px",
              toolbar: [
                "imageStyle:alignLeft",
                "imageStyle:full",
                "imageStyle:alignRight",
                "|",
                "imageTextAlternative",
              ],
              styles: ["full", "alignLeft", "alignRight"],
            },
            typing: {
              transformations: {
                remove: [
                  "enDash",
                  "emDash",
                  "oneHalf",
                  "oneThird",
                  "twoThirds",
                  "oneForth",
                  "threeQuarters",
                ],
              },
            },
            language: "ko",
            fontColor: {
              columns: 10,
              documentColors: 200,
              colors: colorArray,
            },
            fontBackgroundColor: {
              columns: 10,
              documentColors: 200,
              colors: colorArray,
            },
          }}
          editor={ClassicEditor}
        />
      </div>
    );
  }
}

export default Editor;
