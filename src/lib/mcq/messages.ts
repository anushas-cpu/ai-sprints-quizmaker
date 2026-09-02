export const MCQ_MESSAGES = {
	list: {
		empty: "No multiple choice questions yet. Create your first one to get started.",
	},
	form: {
		serverError: "Something went wrong while saving the question. Please try again.",
		notFound: "That question could not be found.",
	},
	delete: {
		serverError: "Something went wrong while deleting the question. Please try again.",
		success: "Question deleted.",
	},
	attempt: {
		serverError: "Something went wrong while recording your attempt. Please try again.",
		invalidChoice: "The selected choice is not valid for this question.",
	},
} as const;
