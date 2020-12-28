import { deployments } from '../types/types';

const deployments: deployments = {
  mainnet: {
    core: {
      address: 'coreAddress',
      checksum: '4f41c2669c3833e0d3ddafff4367639e19368632eeff3318a7d58b97487aaf0a',
    },
    oven: {
      checksum: '30ff3bf43add44eb02f4dc7e6c2b0b0c0d591d6d6ad6e5ea6be99777bbcb2cf9',
    },
    token: {
      address: '',
      checksum: 'd2ae9a2e440a88315bd95afef8bd8f0a9801b7eec901b04e4b9a965281a27404',
    },
  },
  delphinet: {
    core: {
      address: 'KT1VMHXqjocCDZJ9cVwbtM1saLmXjyxwPb2h',
      checksum: '4f41c2669c3833e0d3ddafff4367639e19368632eeff3318a7d58b97487aaf0a',
    },
    oven: {
      checksum: '30ff3bf43add44eb02f4dc7e6c2b0b0c0d591d6d6ad6e5ea6be99777bbcb2cf9',
    },
    token: {
      address: '',
      checksum: 'd2ae9a2e440a88315bd95afef8bd8f0a9801b7eec901b04e4b9a965281a27404',
    },
  },
  localhost: {
    core: {
      address: 'coreAddress',
      checksum: '4f41c2669c3833e0d3ddafff4367639e19368632eeff3318a7d58b97487aaf0a',
    },
    oven: {
      checksum: '30ff3bf43add44eb02f4dc7e6c2b0b0c0d591d6d6ad6e5ea6be99777bbcb2cf9',
    },
    token: {
      address: '',
      checksum: '',
    },
  },
};

export = { deployments };
