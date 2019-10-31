import { connect } from 'react-redux';
import { UserPreferencesModal } from '@ohif/ui';
import OHIF from '@ohif/core';
import { hotkeysManager } from './../App.js';

const { setUserPreferences } = OHIF.redux.actions;

const mapStateToProps = (state, ownProps) => {
  const isEmpty = obj => Object.keys(obj).length === 0;
  return {
    isOpen: ownProps.isOpen,
    windowLevelData: state.preferences ? state.preferences.windowLevelData : {},
    hotKeysData:
      state.preferences && !isEmpty(state.preferences.hotKeysData)
        ? state.preferences.hotKeysData
        : hotkeysManager.hotkeyDefinitions,
  };
};

/* HotkeysManager's hotkeysDefinitions have different output/input. */
const hotkeysManagerFormatter = hotKeysData => {
  const hotKeysCommands = Object.keys(hotKeysData);
  return hotKeysCommands.map(commandName => {
    const definition = hotKeysData[commandName];

    return {
      commandName,
      keys: definition.keys,
      label: definition.label,
    };
  });
};

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    onLoad: hotKeysData => {
      hotkeysManager.setHotkeys(hotkeysManagerFormatter(hotKeysData));
    },
    onSave: ({ windowLevelData, hotKeysData }) => {
      hotkeysManager.setHotkeys(hotkeysManagerFormatter(hotKeysData));
      dispatch(setUserPreferences({ windowLevelData, hotKeysData }));
      ownProps.onSave();
    },
    onResetToDefaults: () => {
      hotkeysManager.restoreDefaultBindings();
      dispatch(setUserPreferences());
      ownProps.onResetToDefaults();
    },
  };
};

const ConnectedUserPreferencesModal = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPreferencesModal);

export default ConnectedUserPreferencesModal;