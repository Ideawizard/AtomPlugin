'use babel';

import RyanWordCountView from './ryan-word-count-view';
import { CompositeDisposable } from 'atom';

export default {

  ryanWordCountView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.ryanWordCountView = new RyanWordCountView(state.ryanWordCountViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.ryanWordCountView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'ryan-word-count:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.ryanWordCountView.destroy();
  },

  serialize() {
    return {
      ryanWordCountViewState: this.ryanWordCountView.serialize()
    };
  },

  toggle() {
    if (this.modalPanel.isVisible()) {
      this.modalPanel.hide();
    } else {
      const editor = atom.workspace.getActiveTextEditor();
      const words = editor.getText().split(/\s+/).length;
      this.ryanWordCountView.setCount(words);
      this.modalPanel.show();
    }
  }
};
