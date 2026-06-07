import os
from dotenv import load_dotenv

load_dotenv()

ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
FACEBOOK_PAGE_ID = os.getenv("FACEBOOK_PAGE_ID")
FACEBOOK_ACCESS_TOKEN = os.getenv("FACEBOOK_ACCESS_TOKEN")

AGENCY_NAME = os.getenv("AGENCY_NAME", "Djen-Djen Travel")
UMRAH_PRICE = os.getenv("UMRAH_PRICE", "215,000 DZD")
CONTACT_PHONE = os.getenv("CONTACT_PHONE", "")
CONTACT_WHATSAPP = os.getenv("CONTACT_WHATSAPP", "")

OUTPUT_DIR = os.getenv("OUTPUT_DIR", "output")
MODEL = os.getenv("CLAUDE_MODEL", "claude-haiku-4-5-20251001")
