import click
import frappe
from frappe.desk.page.setup_wizard.setup_wizard import add_all_roles_to, make_records


def after_install():
	try:
		print("Setting up FlowConnect...")
		add_all_roles_to("Administrator")
		create_raven_user_for_administrator()
		create_general_channel()

		click.secho("Thank you for installing FlowConnect!", fg="green")

	except Exception as e:
		click.secho(
			"Installation for FlowConnect failed due to an error."
			" Please try re-installing the app or contact FLOW support if not resolved.",
			fg="bright_red",
		)
		raise e


def create_raven_user_for_administrator():

	if not frappe.db.exists("Raven User", {"user": "Administrator"}):
		frappe.get_doc(
			{
				"doctype": "Raven User",
				"user": "Administrator",
				"full_name": "Administrator",
				"type": "User",
			}
		).insert(ignore_permissions=True)


def create_general_channel():
	default_workspace = frappe.get_doc(
		{
			"doctype": "Raven Workspace",
			"workspace_name": "FlowConnect",
			"type": "Public",
		}
	)
	default_workspace.insert(ignore_permissions=True)

	# Make all users a member of this workspace and set them as admins
	users = frappe.get_all("Raven User")
	for user in users:
		try:
			frappe.get_doc(
				{
					"doctype": "Raven Workspace Member",
					"workspace": default_workspace.name,
					"user": user.name,
					"is_admin": True,
				}
			).insert(ignore_permissions=True)
		except Exception as e:
			pass  # nosemgrep

	channel = [
		{
			"doctype": "Raven Channel",
			"name": "general",
			"type": "Open",
			"channel_name": "General",
			"workspace": default_workspace.name,
		}
	]

	make_records(channel)


def apply_flowconnect_branding():
	"""Rename the upstream default workspace without changing Raven DocType names."""
	if (
		frappe.db.exists("DocType", "Raven Workspace")
		and frappe.db.exists("Raven Workspace", "Raven")
		and not frappe.db.exists("Raven Workspace", "FlowConnect")
	):
		frappe.rename_doc("Raven Workspace", "Raven", "FlowConnect", force=True)
	if frappe.db.exists("Raven Workspace", "FlowConnect"):
		frappe.db.set_value(
			"Raven Workspace",
			"FlowConnect",
			"logo",
			"/assets/raven/flow-connect-logo.png",
			update_modified=False,
		)
	if frappe.db.exists("DocType", "Raven Settings"):
		oauth_client = frappe.db.get_single_value("Raven Settings", "oauth_client")
		if oauth_client and frappe.db.exists("OAuth Client", oauth_client):
			frappe.db.set_value(
				"OAuth Client", oauth_client, "app_name", "FlowConnect Mobile", update_modified=False
			)
	frappe.clear_cache()
