import React from 'react';
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt';
import { classes, extension } from 'common/util';
import { actions } from 'reducers';
import { connect } from 'react-redux';
import { languages } from 'common/config';
import { Button, Ellipsis, FoldableAceEditor } from 'components';
import styles from './CodeEditor.module.scss';

class CodeEditor extends React.Component {
  constructor(props) {
    super(props);

    this.aceEditorRef = React.createRef();
  }

  handleResize() {
    this.aceEditorRef.current.resize();
  }

  render() {
    const { className } = this.props;
    const { editingFile } = this.props.current;
    const { lineIndicator } = this.props.player;

    if (!editingFile) return null;

    const fileExt = extension(editingFile.name);
    const language = languages.find(language => language.ext === fileExt);
    const mode = language ? language.mode :
      fileExt === 'md' ? 'markdown' :
        fileExt === 'json' ? 'json' :
          'plain_text';

    return (
      <div className={classes(styles.code_editor, className)}>
        <FoldableAceEditor
          className={styles.ace_editor}
          ref={this.aceEditorRef}
          mode={mode}
          theme="tomorrow_night_eighties"
          name="code_editor"
          editorProps={{ $blockScrolling: true }}
          onChange={code => this.props.modifyFile(editingFile, code)}
          markers={lineIndicator ? [{
            startRow: lineIndicator.lineNumber,
            startCol: 0,
            endRow: lineIndicator.lineNumber,
            endCol: Infinity,
            className: styles.current_line_marker,
            type: 'line',
            inFront: true,
            _key: lineIndicator.cursor,
          }] : []}
          value={editingFile.content}/>
        <div className={classes(styles.contributors_viewer, className)}>
          <div className={styles.empty}>
            <div className={styles.empty}/>
            <Button className={styles.delete} icon={faTrashAlt} primary confirmNeeded
                    onClick={() => this.props.deleteFile(editingFile)}>
              <Ellipsis>删除文件</Ellipsis>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(({ current, env, player }) => ({ current, env, player }), actions, null, { forwardRef: true })(
  CodeEditor,
);
