import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import AutosizeInput from 'react-input-autosize';
import screenfull from 'screenfull';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import faAngleRight from '@fortawesome/fontawesome-free-solid/faAngleRight';
import faCaretDown from '@fortawesome/fontawesome-free-solid/faCaretDown';
import faCaretRight from '@fortawesome/fontawesome-free-solid/faCaretRight';
import faExpandArrowsAlt from '@fortawesome/fontawesome-free-solid/faExpandArrowsAlt';
import faStar from '@fortawesome/fontawesome-free-solid/faStar';
import { classes } from 'common/util';
import { actions } from 'reducers';
import { languages } from 'common/config';
import { BaseComponent, Button, Ellipsis, ListItem, Player } from 'components';
import styles from './Header.module.scss';

class Header extends BaseComponent {
  handleClickFullScreen() {
    if (screenfull.enabled) {
      if (screenfull.isFullscreen) {
        screenfull.exit();
      } else {
        screenfull.request();
      }
    }
  }

  handleChangeTitle(e) {
    const { value } = e.target;
    this.props.modifyTitle(value);
  }

  render() {
    const { className, onClickTitleBar, navigatorOpened } = this.props;
    const { scratchPaper, titles } = this.props.current;
    const { ext } = this.props.env;

    return (
      <header className={classes(styles.header, className)}>
        <div className={styles.row}>
          <div className={styles.section}>
            <Button className={styles.title_bar} onClick={onClickTitleBar}>
              {
                titles.map((title, i) => [
                  scratchPaper && i === 1 ?
                    <AutosizeInput className={styles.input_title} key={`title-${i}`} value={title}
                                   onClick={e => e.stopPropagation()} onChange={e => this.handleChangeTitle(e)}/> :
                    <Ellipsis key={`title-${i}`}>{title}</Ellipsis>,
                  i < titles.length - 1 &&
                  <FontAwesomeIcon className={styles.nav_arrow} fixedWidth icon={faAngleRight} key={`arrow-${i}`}/>,
                ])
              }
              <FontAwesomeIcon className={styles.nav_caret} fixedWidth
                               icon={navigatorOpened ? faCaretDown : faCaretRight}/>
            </Button>
          </div>
          <div className={styles.section}>
            <Button icon={faExpandArrowsAlt} primary
                    onClick={() => this.handleClickFullScreen()}>全屏</Button>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.section}>
            <Button className={styles.btn_dropdown} icon={faStar}>
              {languages.find(language => language.ext === ext).name}
              <div className={styles.dropdown}>
                {
                  languages.map(language => language.ext === ext ? null : (
                    <ListItem key={language.ext} onClick={() => this.props.setExt(language.ext)}
                              label={language.name}/>
                  ))
                }
              </div>
            </Button>
          </div>
          <Player className={styles.section}/>
        </div>
      </header>
    );
  }
}

export default withRouter(
  connect(({ current, env }) => ({ current, env }), actions)(
    Header,
  ),
);

