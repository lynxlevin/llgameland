crumb :root do
  link "TOP", root_path
end

crumb :new_game do
  link "new_game", new_game_path
  parent :root
end

crumb :edit_game do
  link "edit_game", edit_game_path
  parent :root
end

crumb :show_game do |game|
  link game[0].display_name, show_game_path(game)
  parent :root
end

crumb :about do
  link "ABOUT", about_path
  parent :root
end

crumb :images do
  link "images", images_path
  parent :root
end

crumb :new_user_registration do
  link "ユーザー登録", new_user_registration_path
  parent :root
end

crumb :new_user_session do
  link "ログイン", new_user_session_path
  parent :root
end

crumb :edit_user_registration do |user|
  link "ユーザー情報編集(" + user.username + ")", edit_user_registration_path
  parent :root
end

# crumb :project do |project|
#   link project.name, project_path(project)
#   parent :projects
# end

# crumb :project_issues do |project|
#   link "Issues", project_issues_path(project)
#   parent :project, project
# end

# crumb :issue do |issue|
#   link issue.title, issue_path(issue)
#   parent :project_issues, issue.project
# end

# If you want to split your breadcrumbs configuration over multiple files, you
# can create a folder named `config/breadcrumbs` and put your configuration
# files there. All *.rb files (e.g. `frontend.rb` or `products.rb`) in that
# folder are loaded and reloaded automatically when you change them, just like
# this file (`config/breadcrumbs.rb`).