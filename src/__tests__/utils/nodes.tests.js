import { parseNodeCapabilities,
         stringifyNodeCapabilities,
         setNodeCapability } from '../../js/utils/nodes';

describe('parseNodeCapabilities', () => {
  beforeEach(function() {
    this.capabilitiesString = 'capability1:cap1,capability2:cap2';
  });

  it('returns an object from capabilities string', function() {
    const expectedObject = {
      capability1: 'cap1',
      capability2: 'cap2'
    };
    expect(parseNodeCapabilities(this.capabilitiesString)).toEqual(expectedObject);
  });
});

describe('stringifyNodeCapabilities', () => {
  beforeEach(function() {
    this.capabilitiesObject = {
      capability1: 'cap1',
      capability2: 'cap2'
    };
  });

  it('returns an string from capabilities object', function() {
    const expectedString = 'capability1:cap1,capability2:cap2';
    expect(stringifyNodeCapabilities(this.capabilitiesObject)).toEqual(expectedString);
  });

  it('removes capabilities with empty value', function() {
    const capabilitiesObject = {
      capability1: 'cap1',
      capability2: 'cap2',
      capability3: ''
    };
    const expectedString = 'capability1:cap1,capability2:cap2';
    expect(stringifyNodeCapabilities(capabilitiesObject)).toEqual(expectedString);
  });
});

describe('setNodeCapability', () => {
  it('updates node capabilities with new capability', function() {
    const inputString = 'capability1:cap1,capability2:cap2';
    const expectedString = 'capability1:cap1,capability2:cap2,capability3:cap3';
    expect(setNodeCapability(inputString, 'capability3', 'cap3')).toEqual(expectedString);
  });

  it('updates existing node capability', function() {
    const inputString = 'capability1:cap1,capability2:cap2';
    const expectedString = 'capability1:cap1,capability2:newValue';
    expect(setNodeCapability(inputString, 'capability2', 'newValue')).toEqual(expectedString);
  });
});
