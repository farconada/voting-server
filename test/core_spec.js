import {List, Map} from 'immutable';
import {expect} from 'chai';
import {setEntries, next, vote} from '../src/core';

describe('application logic', () => {
    describe('setEntries', () => {
        it('adds the entries to the state', () => {
            const state = Map();
            const entries = List.of('A', 'B');
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({entries: List.of('A', 'B')}));
        });
    });

    describe('next', () => {
        it('it takes the next two entries under vote', () => {
            const state = Map({entries: List.of('A', 'B', 'C')});
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({pair: List.of('A', 'B')}),
                entries: List.of('C')
            }));
        });

        it('puts the winner of current vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('A', 'B'),
                    tally: Map({'A': 4, 'B': 2})
                }),
                entries: List.of('D', 'E', 'F')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('D', 'E')
                }),
                entries: List.of('F', 'A')
            }));
        });

        it('puts both from tied vote back to entries', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('A', 'B'),
                    tally: Map({'A': 4, 'B': 4})
                }),
                entries: List.of('D', 'E', 'F')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('D', 'E')
                }),
                entries: List.of('F', 'A', 'B')
            }));
        });

        it('marks winner when just one entry left', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('A', 'B'),
                    tally: Map({'A': 3, 'B': 1})
                }),
                entries: List()
            });

            const nextState = next(state);
            expect(nextState).to.equal(Map({winner: 'A'}));
        });
    });

    describe('vote', () => {
        it('creates a tally for the voted entry', () => {
            const state = Map({
                vote: Map({pair: List.of('A', 'B')}),
                entries: List()
            });
            const nextState = vote(state, 'A');
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('A', 'B'),
                    tally: Map({'A': 1})
                }),
                entries: List()
            }));
        });

        it('adds to existing tally for the voted entry', () => {
            const state = Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 3,
                        '28 Days Later': 2
                    })
                }),
                entries: List()
            });
            const nextState = vote(state, 'Trainspotting');
            expect(nextState).to.equal(Map({
                vote: Map({
                    pair: List.of('Trainspotting', '28 Days Later'),
                    tally: Map({
                        'Trainspotting': 4,
                        '28 Days Later': 2
                    })
                }),
                entries: List()
            }));
        });

    });
});