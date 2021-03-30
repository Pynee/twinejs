import {Story, StoriesDispatch} from '../../stories.types';
import {fakeStory} from '../../../../test-util/fakes';
import {createNewlyLinkedPassages} from '../create-newly-linked-passages';

describe('createNewlyLinkedPassages', () => {
	let dispatch: StoriesDispatch;
	let dispatchMock: jest.Mock;
	let story: Story;

	beforeEach(() => {
		dispatch = jest.fn();
		dispatchMock = dispatch as jest.Mock;
		story = fakeStory(1);
	});

	it('calls dispatch to create new passages', () => {
		story.passages[0].text = '';

		createNewlyLinkedPassages(
			dispatch,
			story,
			story.passages[0],
			'[[test link]]',
			''
		);

		expect(dispatchMock.mock.calls).toEqual([
			[
				{
					type: 'createPassage',
					storyId: story.id,
					props: expect.objectContaining({name: 'test link'}),
				},
			],
		]);
	});

	it('takes no action if no links were added', () => {
		createNewlyLinkedPassages(
			dispatch,
			story,
			story.passages[0],
			story.passages[0].text + 'not a link',
			story.passages[0].text
		);

		expect(dispatchMock.mock.calls).toEqual([]);
	});

	it('takes no action if the newly-linked passage already exists', () => {
		story = fakeStory(2);
		createNewlyLinkedPassages(
			dispatch,
			story,
			story.passages[0],
			story.passages[0].text + `[[${story.passages[1].name}]]`,
			story.passages[0].text
		);

		expect(dispatchMock.mock.calls).toEqual([]);
	});

	it('takes no action if the broken link was already present', () => {
		story.passages[0].text = '[[broken link]]';
		createNewlyLinkedPassages(
			dispatch,
			story,
			story.passages[0],
			story.passages[0].text + 'not a link',
			story.passages[0].text
		);

		expect(dispatchMock.mock.calls).toEqual([]);
	});

	it("throws an error if the passage doesn't belong to the story", () =>
		expect(() =>
			createNewlyLinkedPassages(
				dispatch,
				story,
				{...story.passages[0], id: 'nonexistent'},
				story.passages[0].text,
				story.passages[0].text
			)
		).toThrow());
});
