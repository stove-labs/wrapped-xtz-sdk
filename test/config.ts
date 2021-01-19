const { bob, carol, dave } = require('../scripts/tools/sandbox/scripts/sandbox/accounts');
const ovenWithDelegate = require('../scripts/tools/sandbox/deployments/ovenWithDelegate');
const ovenWithoutDelegate = require('../scripts/tools/sandbox/deployments/ovenWithoutDelegate');
const core = require('../scripts/tools/sandbox/deployments/core');
const token = require('../scripts/tools/sandbox/deployments/tzip-7');
const defaultDeployments = require('../src/deployments.json');

const deployment = defaultDeployments.localhost;
deployment.core.address = core;
deployment.token.address = token;
deployment.oven.address = ovenWithDelegate;

export default {
  ovenWithDelegate,
  ovenWithoutDelegate,
  deployment,
  core,
  dave,
  ovenOwner: carol,
  delegate: bob,
  rpc: 'http://localhost:8732',
  indexerUrl: 'http://localhost:8000',
  amount: 100,
  token,
  ovenContractCodeMicheline: [
    {
      prim: 'parameter',
      args: [
        {
          prim: 'or',
          args: [
            {
              prim: 'or',
              args: [
                { prim: 'unit', annots: ['%default'] },
                { prim: 'option', args: [{ prim: 'key_hash' }], annots: ['%setDelegate'] },
              ],
            },
            { prim: 'nat', annots: ['%withdraw'] },
          ],
        },
      ],
    },
    { prim: 'storage', args: [{ prim: 'address' }] },
    {
      prim: 'code',
      args: [
        [
          {
            prim: 'LAMBDA',
            args: [
              {
                prim: 'pair',
                args: [
                  {
                    prim: 'pair',
                    args: [{ prim: 'pair', args: [{ prim: 'string' }, { prim: 'bytes' }] }, { prim: 'mutez' }],
                  },
                  { prim: 'address' },
                ],
              },
              { prim: 'operation' },
              [
                { prim: 'DUP' },
                { prim: 'CDR' },
                {
                  prim: 'CONTRACT',
                  args: [
                    {
                      prim: 'pair',
                      args: [
                        { prim: 'string', annots: ['%lambdaName'] },
                        { prim: 'bytes', annots: ['%lambdaParameter'] },
                      ],
                    },
                  ],
                  annots: ['%runEntrypointLambda'],
                },
                {
                  prim: 'IF_NONE',
                  args: [[{ prim: 'PUSH', args: [{ prim: 'string' }, { string: '7' }] }, { prim: 'FAILWITH' }], []],
                },
                { prim: 'SWAP' },
                { prim: 'DUP' },
                { prim: 'DUG', args: [{ int: '2' }] },
                { prim: 'CAR' },
                { prim: 'CDR' },
                { prim: 'DIG', args: [{ int: '2' }] },
                { prim: 'CAR' },
                { prim: 'CAR' },
                { prim: 'TRANSFER_TOKENS' },
              ],
            ],
          },
          { prim: 'SWAP' },
          { prim: 'DUP' },
          { prim: 'CDR' },
          { prim: 'SWAP' },
          { prim: 'CAR' },
          {
            prim: 'IF_LEFT',
            args: [
              [
                {
                  prim: 'IF_LEFT',
                  args: [
                    [
                      { prim: 'DROP' },
                      { prim: 'DUP' },
                      { prim: 'SENDER' },
                      { prim: 'COMPARE' },
                      { prim: 'EQ' },
                      {
                        prim: 'IF',
                        args: [
                          [
                            { prim: 'SWAP' },
                            { prim: 'DROP' },
                            { prim: 'NIL', args: [{ prim: 'operation' }] },
                            { prim: 'PAIR' },
                          ],
                          [
                            { prim: 'DUP' },
                            { prim: 'AMOUNT' },
                            { prim: 'PUSH', args: [{ prim: 'unit' }, { prim: 'Unit' }] },
                            { prim: 'PACK' },
                            { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'onOvenDepositReceived' }] },
                            { prim: 'PAIR' },
                            { prim: 'PAIR' },
                            { prim: 'PAIR' },
                            { prim: 'DIG', args: [{ int: '2' }] },
                            { prim: 'SWAP' },
                            { prim: 'EXEC' },
                            { prim: 'SWAP' },
                            { prim: 'NIL', args: [{ prim: 'operation' }] },
                            { prim: 'DIG', args: [{ int: '2' }] },
                            { prim: 'CONS' },
                            { prim: 'PAIR' },
                          ],
                        ],
                      },
                    ],
                    [
                      { prim: 'PAIR' },
                      { prim: 'DUP' },
                      { prim: 'CDR' },
                      { prim: 'SENDER' },
                      { prim: 'SWAP' },
                      { prim: 'DUP' },
                      { prim: 'DUG', args: [{ int: '2' }] },
                      { prim: 'AMOUNT' },
                      { prim: 'DIG', args: [{ int: '2' }] },
                      { prim: 'PACK' },
                      { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'onOvenSetDelegate' }] },
                      { prim: 'PAIR' },
                      { prim: 'PAIR' },
                      { prim: 'PAIR' },
                      { prim: 'DIG', args: [{ int: '3' }] },
                      { prim: 'SWAP' },
                      { prim: 'EXEC' },
                      { prim: 'DIG', args: [{ int: '2' }] },
                      { prim: 'CAR' },
                      { prim: 'SET_DELEGATE' },
                      { prim: 'DIG', args: [{ int: '2' }] },
                      { prim: 'NIL', args: [{ prim: 'operation' }] },
                      { prim: 'DIG', args: [{ int: '2' }] },
                      { prim: 'CONS' },
                      { prim: 'DIG', args: [{ int: '2' }] },
                      { prim: 'CONS' },
                      { prim: 'PAIR' },
                    ],
                  ],
                },
              ],
              [
                { prim: 'DUP' },
                { prim: 'DUG', args: [{ int: '2' }] },
                { prim: 'SENDER' },
                { prim: 'PAIR' },
                { prim: 'SWAP' },
                { prim: 'DUP' },
                { prim: 'DUG', args: [{ int: '2' }] },
                { prim: 'AMOUNT' },
                { prim: 'DIG', args: [{ int: '2' }] },
                { prim: 'PACK' },
                { prim: 'PUSH', args: [{ prim: 'string' }, { string: 'onOvenWithdrawalRequested' }] },
                { prim: 'PAIR' },
                { prim: 'PAIR' },
                { prim: 'PAIR' },
                { prim: 'DIG', args: [{ int: '3' }] },
                { prim: 'SWAP' },
                { prim: 'EXEC' },
                { prim: 'SENDER' },
                { prim: 'CONTRACT', args: [{ prim: 'unit' }] },
                {
                  prim: 'IF_NONE',
                  args: [[{ prim: 'PUSH', args: [{ prim: 'string' }, { string: '15' }] }, { prim: 'FAILWITH' }], []],
                },
                { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '1' }] },
                { prim: 'DIG', args: [{ int: '4' }] },
                { prim: 'MUL' },
                { prim: 'PUSH', args: [{ prim: 'unit' }, { prim: 'Unit' }] },
                { prim: 'TRANSFER_TOKENS' },
                { prim: 'DIG', args: [{ int: '2' }] },
                { prim: 'NIL', args: [{ prim: 'operation' }] },
                { prim: 'DIG', args: [{ int: '2' }] },
                { prim: 'CONS' },
                { prim: 'DIG', args: [{ int: '2' }] },
                { prim: 'CONS' },
                { prim: 'PAIR' },
              ],
            ],
          },
        ],
      ],
    },
  ],
};
