import {expect} from 'chai';
import {List} from 'immutable';


describe('immutability', () => {
    describe('A List', () => {
        function addMovie(currentState, movie){
            return currentState.push(movie);
        }

        it('is immutable', () => {
            let state = List.of('A', 'B');
            let nextState = addMovie(state, 'C');

            expect(nextState).to.equal(List.of('A', 'B', 'C'));
            expect(state).to.equal(List.of('A','B'));
        });
    });
});