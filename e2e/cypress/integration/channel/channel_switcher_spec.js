// Copyright (c) 2015-present Mattermost, Inc. All Rights Reserved.
// See LICENSE.txt for license information.

// ***************************************************************
// - [#] indicates a test step (e.g. # Go to a page)
// - [*] indicates an assertion (e.g. * Check the title)
// - Use element ID when selecting an element. Create one if none.
// ***************************************************************

// Stage: @prod
// Group: @channel @smoke

describe('Channel Switcher', () => {
    let testTeam;

    before(() => {
        cy.apiInitSetup().then(({team, user}) => {
            testTeam = team;

            // # Add some channels
            cy.apiCreateChannel(testTeam.id, 'channel-a', 'SwitchChannel A', 'O');
            cy.apiCreateChannel(testTeam.id, 'channel-b', 'SwitchChannel B', 'O');
            cy.apiCreateChannel(testTeam.id, 'channel-c', 'SwitchChannel C', 'O');

            // # Login as test user and go to town square
            cy.apiLogin(user);
            cy.visit(`/${team.name}/channels/town-square`);
        });
    });

    it('MM-T2031 - should switch channels by keyboard', () => {
        // # Press CTRL+K (Windows) or CMD+K(Mac)
        cy.typeCmdOrCtrl().type('K', {release: true});

        // # Start typing channel name in the "Switch Channels" modal message box
        // # Use up/down arrow keys to highlight second channel
        // # Press ENTER
        cy.get('#quickSwitchInput').type('SwitchChannel ').type('{downarrow}').type('{downarrow}').type('{enter}');

        // * Expect channel title to match title
        cy.get('#channelHeaderTitle').
            should('be.visible').
            and('contain.text', 'SwitchChannel B');

        // * Expect url to match url
        cy.url().should('contain', 'channel-b');
    });

    it('MM-T2031 - should switch channels by mouse', () => {
        // # Press CTRL+K (Windows) or CMD+K(Mac)
        cy.typeCmdOrCtrl().type('K', {release: true});

        // # Start typing channel name in the "Switch Channels" modal message box
        cy.get('#quickSwitchInput').type('SwitchChannel ');

        cy.get('[data-testid^=channel-c] > span').click();

        // * Expect channel title to match title
        cy.get('#channelHeaderTitle').
            should('be.visible').
            and('contain.text', 'SwitchChannel C');

        // * Expect url to match url
        cy.url().should('contain', 'channel-c');
    });

    it('MM-T2031 - should show empty result', () => {
        // # Press CTRL+K (Windows) or CMD+K(Mac)
        cy.typeCmdOrCtrl().type('K', {release: true});

        // # Type invalid channel name in the "Switch Channels" modal message box
        cy.get('#quickSwitchInput').type('there-is-no-spoon');

        // * Expect 'nothing found' message
        cy.get('.no-results__title > span').should('be.visible');
    });
});
