const actionTypePrefix = 'HB/';

export default function(name) {
  const prefix = actionTypePrefix + name + '.';
  return {
    REQUEST: prefix + 'REQUEST',
    SUCCESS: prefix + 'SUCCESS',
    FAILURE: prefix + 'FAILURE',
  };
}
