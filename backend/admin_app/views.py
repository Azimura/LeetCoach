from flask_admin.contrib.sqla import ModelView

class ProblemAdmin(ModelView):
    column_list = ('id', 'out_id', 'title', 'content', 'difficulty', 'problem_tags')  # Show primary key and relationship
    form_columns = ('out_id', 'title', 'content', 'difficulty', 'code_template')
    column_filters = ('difficulty',)

class UserAdmin(ModelView):
    column_list = ('id', 'username')  # Show primary key
    form_columns = ('username',)      # Exclude id from form
    column_searchable_list = ('username',)

class TagAdmin(ModelView):
    column_list = ('id', 'name')
    form_columns = ('name', )
    column_searchable_list = ('name',)

class ProblemTagAdmin(ModelView):
    column_list = ('id', 'problem_id', 'tag_id')
    form_columns = ('problem_id', 'tag_id')
    form_excluded_columns = ('id',)

class SubmissionAdmin(ModelView):
    column_list = ('id', 'user_id', 'problem_id', 'code', 'result', 'submission_type', 'test_passed', 'test_total', 'submission_time')
    form_excluded_columns = ('id',)

class UserProgressAdmin(ModelView):
    column_list = ('id', 'user_id', 'problem_id', 'start_time')
    form_excluded_columns = ('id',)

class TestCaseAdmin(ModelView):
    column_list = ('id', 'problem_id', 'input_data', 'expected_output', 'is_sample')
    form_columns = ('problem_id', 'input_data', 'expected_output', 'is_sample')
    form_excluded_columns = ('id',)

class RefineAdmin(ModelView):
    column_list = ('id', 'user_id', 'problem_id', 'input_code', 'answer', 'result', 'refine_time')
