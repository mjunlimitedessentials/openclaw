"""Generate the Mona Jackson-Ham Media Kit PDF."""

from reportlab.lib.pagesizes import LETTER
from reportlab.lib.colors import HexColor, white
from reportlab.lib.units import inch
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (
    BaseDocTemplate,
    PageTemplate,
    Frame,
    Paragraph,
    Spacer,
    PageBreak,
    NextPageTemplate,
    Table,
    TableStyle,
    KeepTogether,
)
from reportlab.pdfgen import canvas

OUTPUT = "Mona_Jackson-Ham_Media_Kit.pdf"

NAVY = HexColor("#1a2a44")
PLUM = HexColor("#3a1f5d")
GOLD = HexColor("#c9a55c")
CREAM = HexColor("#faf7f2")
CHARCOAL = HexColor("#2c2c2c")
SOFT_GRAY = HexColor("#6b6b6b")
LIGHT_GOLD = HexColor("#f3e9d2")

PAGE_W, PAGE_H = LETTER


def cover_page(c, doc):
    """Cover page background and decorative elements."""
    c.saveState()
    # Full background plum
    c.setFillColor(PLUM)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Gold accent bar - vertical left
    c.setFillColor(GOLD)
    c.rect(0, 0, 0.35 * inch, PAGE_H, fill=1, stroke=0)

    # Gold ornamental line near top
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.2)
    c.line(1.2 * inch, PAGE_H - 1.3 * inch, 4.0 * inch, PAGE_H - 1.3 * inch)

    # MEDIA KIT label
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(1.2 * inch, PAGE_H - 1.55 * inch, "M E D I A   K I T   •   2 0 2 6")

    # Name - large display
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 44)
    c.drawString(1.2 * inch, PAGE_H - 3.2 * inch, "Mona")
    c.drawString(1.2 * inch, PAGE_H - 3.85 * inch, "Jackson-Ham")

    # Title
    c.setFillColor(LIGHT_GOLD)
    c.setFont("Helvetica-Oblique", 16)
    c.drawString(1.2 * inch, PAGE_H - 4.35 * inch,
                 "Founder  •  AI Educator  •  Brand Strategist")

    # Divider
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.8)
    c.line(1.2 * inch, PAGE_H - 4.7 * inch, 3.0 * inch, PAGE_H - 4.7 * inch)

    # Companies
    c.setFillColor(white)
    c.setFont("Helvetica-Bold", 13)
    c.drawString(1.2 * inch, PAGE_H - 5.2 * inch, "MJUnlimited Essential Marketing")
    c.drawString(1.2 * inch, PAGE_H - 5.5 * inch, "ThinkBox AI Operation Systems")

    # Tagline at bottom
    c.setFillColor(LIGHT_GOLD)
    c.setFont("Helvetica-Oblique", 12)
    tagline = "Helping purpose-driven brands grow with AI, strategy, and clarity."
    c.drawString(1.2 * inch, 1.6 * inch, tagline)

    # Footer brand
    c.setFillColor(GOLD)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(1.2 * inch, 0.9 * inch, "M J U N L I M I T E D   •   T H I N K B O X   A I")

    c.restoreState()


def content_page(c, doc):
    """Header/footer decoration for content pages."""
    c.saveState()
    # Cream background
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, fill=1, stroke=0)

    # Top gold accent bar
    c.setFillColor(GOLD)
    c.rect(0, PAGE_H - 0.3 * inch, PAGE_W, 0.3 * inch, fill=1, stroke=0)

    # Plum thin band
    c.setFillColor(PLUM)
    c.rect(0, PAGE_H - 0.35 * inch, PAGE_W, 0.05 * inch, fill=1, stroke=0)

    # Footer
    c.setFillColor(PLUM)
    c.rect(0, 0, PAGE_W, 0.5 * inch, fill=1, stroke=0)
    c.setFillColor(GOLD)
    c.rect(0, 0.5 * inch, PAGE_W, 0.04 * inch, fill=1, stroke=0)

    # Footer text
    c.setFillColor(LIGHT_GOLD)
    c.setFont("Helvetica-Bold", 8)
    c.drawString(0.75 * inch, 0.2 * inch,
                 "MONA JACKSON-HAM  •  MEDIA KIT 2026")
    c.setFillColor(GOLD)
    c.drawRightString(PAGE_W - 0.75 * inch, 0.2 * inch,
                      f"Page {doc.page - 1}")
    c.restoreState()


def build():
    doc = BaseDocTemplate(
        OUTPUT,
        pagesize=LETTER,
        leftMargin=0.85 * inch,
        rightMargin=0.85 * inch,
        topMargin=0.85 * inch,
        bottomMargin=0.85 * inch,
        title="Mona Jackson-Ham - Media Kit",
        author="Mona Jackson-Ham",
        subject="Media Kit 2026",
    )

    cover_frame = Frame(0, 0, PAGE_W, PAGE_H, id="cover", showBoundary=0)
    content_frame = Frame(
        0.85 * inch, 0.75 * inch,
        PAGE_W - 1.7 * inch, PAGE_H - 1.6 * inch,
        id="content", showBoundary=0,
    )

    doc.addPageTemplates([
        PageTemplate(id="Cover", frames=[cover_frame], onPage=cover_page),
        PageTemplate(id="Content", frames=[content_frame], onPage=content_page),
    ])

    # --- Styles ---
    h1 = ParagraphStyle(
        "H1", fontName="Helvetica-Bold", fontSize=24, textColor=PLUM,
        spaceAfter=4, leading=28,
    )
    eyebrow = ParagraphStyle(
        "Eyebrow", fontName="Helvetica-Bold", fontSize=9, textColor=GOLD,
        spaceAfter=2, leading=11, letterSpacing=2,
    )
    h2 = ParagraphStyle(
        "H2", fontName="Helvetica-Bold", fontSize=14, textColor=NAVY,
        spaceBefore=14, spaceAfter=6, leading=18,
    )
    body = ParagraphStyle(
        "Body", fontName="Helvetica", fontSize=11, textColor=CHARCOAL,
        leading=16, alignment=TA_JUSTIFY, spaceAfter=8,
    )
    bullet = ParagraphStyle(
        "Bullet", fontName="Helvetica", fontSize=11, textColor=CHARCOAL,
        leading=16, leftIndent=14, bulletIndent=2, spaceAfter=4,
    )
    pull_quote = ParagraphStyle(
        "Pull", fontName="Helvetica-Oblique", fontSize=13, textColor=PLUM,
        leading=18, alignment=TA_CENTER, spaceBefore=10, spaceAfter=10,
    )
    contact_label = ParagraphStyle(
        "CL", fontName="Helvetica-Bold", fontSize=10, textColor=GOLD,
        leading=12, letterSpacing=1,
    )
    contact_value = ParagraphStyle(
        "CV", fontName="Helvetica", fontSize=11, textColor=CHARCOAL,
        leading=14,
    )

    story = []

    # --- Cover (handled by canvas) ---
    story.append(NextPageTemplate("Content"))
    story.append(PageBreak())

    # ====== PAGE 2: ABOUT ======
    story.append(Paragraph("ABOUT  •  THE FOUNDER", eyebrow))
    story.append(Paragraph("Meet Mona", h1))
    story.append(Spacer(1, 0.1 * inch))

    about_text = (
        "I'm Mona Jackson-Ham, founder of <b>MJUnlimited Essential Marketing</b> "
        "and <b>ThinkBox AI Operation Systems</b>. I help entrepreneurs, ministries, "
        "educators, and everyday business owners use AI, branding, automation, and "
        "digital marketing in ways that actually make sense."
    )
    story.append(Paragraph(about_text, body))

    story.append(Paragraph(
        "My content is built on one idea: technology should be simple, strategic, "
        "and useful. I show people how to use AI to save time, sharpen their "
        "operations, build stronger marketing systems, and show up online with "
        "confidence. Alongside that, I create brand visuals, social media content, "
        "business education, faith-based encouragement, and digital strategy "
        "resources for people who want to grow without drowning in tech noise.",
        body,
    ))

    story.append(Paragraph(
        "My work blends creativity, business strategy, and AI education. Through my "
        "platforms, I connect brands with audiences who value innovation, purpose, "
        "professionalism, and real-world results.",
        body,
    ))

    story.append(Spacer(1, 0.15 * inch))
    story.append(Paragraph(
        '“I help people stop being intimidated by AI and start using it to '
        'build smarter, stronger, more efficient businesses.”',
        pull_quote,
    ))

    story.append(PageBreak())

    # ====== PAGE 3: BRANDS ======
    story.append(Paragraph("THE BRANDS", eyebrow))
    story.append(Paragraph("Two Companies. One Mission.", h1))
    story.append(Spacer(1, 0.15 * inch))

    brand_data = [
        [
            Paragraph("<b>MJUnlimited<br/>Essential Marketing</b>", ParagraphStyle(
                "BrandHead", fontName="Helvetica-Bold", fontSize=13,
                textColor=white, leading=16, alignment=TA_CENTER,
            )),
            Paragraph("<b>ThinkBox AI<br/>Operation Systems</b>", ParagraphStyle(
                "BrandHead2", fontName="Helvetica-Bold", fontSize=13,
                textColor=white, leading=16, alignment=TA_CENTER,
            )),
        ],
        [
            Paragraph(
                "Branding, content, and digital marketing strategy for "
                "purpose-driven brands. We design visuals, build content systems, "
                "and create marketing that actually converts — without the "
                "guesswork.",
                ParagraphStyle("BC", fontName="Helvetica", fontSize=10,
                               textColor=CHARCOAL, leading=14, alignment=TA_LEFT),
            ),
            Paragraph(
                "Practical AI education and automation systems for entrepreneurs, "
                "ministries, and small teams. We turn AI tools into workflows that "
                "save time, sharpen operations, and unlock growth.",
                ParagraphStyle("BC2", fontName="Helvetica", fontSize=10,
                               textColor=CHARCOAL, leading=14, alignment=TA_LEFT),
            ),
        ],
    ]
    brand_table = Table(brand_data, colWidths=[3.15 * inch, 3.15 * inch])
    brand_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (0, 0), PLUM),
        ("BACKGROUND", (1, 0), (1, 0), NAVY),
        ("BACKGROUND", (0, 1), (-1, 1), white),
        ("BOX", (0, 1), (0, 1), 1, PLUM),
        ("BOX", (1, 1), (1, 1), 1, NAVY),
        ("LEFTPADDING", (0, 0), (-1, -1), 16),
        ("RIGHTPADDING", (0, 0), (-1, -1), 16),
        ("TOPPADDING", (0, 0), (-1, -1), 18),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 18),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
    ]))
    story.append(brand_table)

    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph("Content Pillars", h2))
    pillars = [
        "<b>AI Education</b> — practical tools, prompts, and workflows business owners can actually use.",
        "<b>Branding &amp; Design</b> — visuals, identity systems, and content that look as strong as they sell.",
        "<b>Marketing Strategy</b> — content frameworks, social media systems, and audience growth playbooks.",
        "<b>Automation &amp; Operations</b> — turning repeatable work into systems that run themselves.",
        "<b>Faith-Based Leadership</b> — purpose, encouragement, and integrity-led business education.",
        "<b>Personal Development</b> — mindset, productivity, and growth for modern entrepreneurs.",
    ]
    for p in pillars:
        story.append(Paragraph(p, bullet, bulletText="◆"))

    story.append(PageBreak())

    # ====== PAGE 4: AUDIENCE ======
    story.append(Paragraph("THE AUDIENCE", eyebrow))
    story.append(Paragraph("Who I Reach", h1))
    story.append(Spacer(1, 0.1 * inch))

    story.append(Paragraph(
        "My audience is made up of business owners, ministry leaders, creatives, "
        "parents, educators, and professionals who are ready to learn, grow, and "
        "use modern tools wisely. They value innovation, purpose, professionalism, "
        "and real-world results.",
        body,
    ))

    story.append(Spacer(1, 0.15 * inch))

    aud_head = ParagraphStyle("AudHead", fontName="Helvetica-Bold",
                              fontSize=9, textColor=GOLD, leading=11)
    aud_label = ParagraphStyle("AudLabel", fontName="Helvetica-Bold",
                               fontSize=10, textColor=NAVY, leading=13)
    aud_value = ParagraphStyle("AudValue", fontName="Helvetica",
                               fontSize=10, textColor=CHARCOAL, leading=13)

    audience_data = [
        [Paragraph("AUDIENCE", aud_head),
         Paragraph("WHAT THEY CARE ABOUT", aud_head)],
        [Paragraph("Entrepreneurs &amp; Small Business Owners", aud_label),
         Paragraph("Growth, marketing systems, automation, saving time",
                   aud_value)],
        [Paragraph("Ministry &amp; Faith-Based Leaders", aud_label),
         Paragraph("Outreach, content, digital presence, purpose-led tools",
                   aud_value)],
        [Paragraph("Educators &amp; Coaches", aud_label),
         Paragraph("Curriculum, content delivery, AI in the classroom",
                   aud_value)],
        [Paragraph("Creatives &amp; Designers", aud_label),
         Paragraph("Branding, AI workflows, social content, design systems",
                   aud_value)],
        [Paragraph("Parents &amp; Professionals", aud_label),
         Paragraph("Productivity, side businesses, practical tech literacy",
                   aud_value)],
    ]
    audience_table = Table(audience_data, colWidths=[2.9 * inch, 3.4 * inch])
    audience_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), PLUM),
        ("TEXTCOLOR", (0, 0), (-1, 0), GOLD),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("FONTNAME", (0, 1), (-1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 10),
        ("TEXTCOLOR", (0, 1), (0, -1), NAVY),
        ("TEXTCOLOR", (1, 1), (1, -1), CHARCOAL),
        ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_GOLD]),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LINEBELOW", (0, 0), (-1, 0), 1.5, GOLD),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(audience_table)

    story.append(Spacer(1, 0.3 * inch))
    story.append(Paragraph("Brand Values My Audience Aligns With", h2))
    values = [
        "Growth &amp; Entrepreneurship",
        "Education &amp; Productivity",
        "Digital Transformation",
        "Innovation with Purpose",
        "Faith, Integrity &amp; Meaningful Impact",
    ]
    for v in values:
        story.append(Paragraph(v, bullet, bulletText="❖"))

    story.append(PageBreak())

    # ====== PAGE 5: WORK WITH ME ======
    story.append(Paragraph("PARTNERSHIPS", eyebrow))
    story.append(Paragraph("Work With Me", h1))
    story.append(Spacer(1, 0.1 * inch))

    story.append(Paragraph(
        "I partner with brands aligned with growth, education, productivity, "
        "digital transformation, entrepreneurship, and meaningful impact. Whether "
        "you're launching a new AI tool, an education platform, a creator product, "
        "or a faith-aligned service, I help you reach an audience that's ready to "
        "buy, learn, and grow.",
        body,
    ))

    story.append(Paragraph("Collaboration Opportunities", h2))
    offerings = [
        "<b>Sponsored Content</b> — Instagram, TikTok, YouTube, and short-form video integrations.",
        "<b>Brand Ambassadorships</b> — long-term partnerships across multiple platforms.",
        "<b>Product Reviews &amp; Tutorials</b> — authentic demos for AI tools, software, and creator products.",
        "<b>Educational Workshops &amp; Webinars</b> — co-hosted trainings for your audience or mine.",
        "<b>Speaking &amp; Panels</b> — keynotes and sessions on AI, branding, and entrepreneurship.",
        "<b>Affiliate &amp; Licensing</b> — referral partnerships and licensed educational content.",
    ]
    for o in offerings:
        story.append(Paragraph(o, bullet, bulletText="◆"))

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph("What You Get", h2))
    deliverables_data = [
        ["DELIVERABLE", "INCLUDES"],
        ["Strategy Call", "Brand alignment, audience fit, campaign goals"],
        ["Custom Content",
         "Scripts, captions, visuals, and on-brand storytelling"],
        ["Multi-Platform Promotion",
         "Instagram, TikTok, YouTube, email, and blog amplification"],
        ["Performance Reporting",
         "Reach, engagement, and conversion metrics post-campaign"],
    ]
    deliverables_table = Table(deliverables_data,
                               colWidths=[2.2 * inch, 4.1 * inch])
    deliverables_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), GOLD),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE", (0, 0), (-1, 0), 9),
        ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
        ("FONTNAME", (1, 1), (1, -1), "Helvetica"),
        ("FONTSIZE", (0, 1), (-1, -1), 10),
        ("TEXTCOLOR", (0, 1), (0, -1), PLUM),
        ("TEXTCOLOR", (1, 1), (1, -1), CHARCOAL),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [white, LIGHT_GOLD]),
        ("LEFTPADDING", (0, 0), (-1, -1), 12),
        ("RIGHTPADDING", (0, 0), (-1, -1), 12),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LINEBELOW", (0, 0), (-1, 0), 1.5, GOLD),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ]))
    story.append(deliverables_table)

    story.append(PageBreak())

    # ====== PAGE 6: CONTACT ======
    story.append(Paragraph("LET'S CONNECT", eyebrow))
    story.append(Paragraph("Contact &amp; Booking", h1))
    story.append(Spacer(1, 0.15 * inch))

    story.append(Paragraph(
        "Ready to collaborate, sponsor, or build something together? I'd love to "
        "hear what you're working on. Reach out using the details below and I'll "
        "respond personally with next steps.",
        body,
    ))

    story.append(Spacer(1, 0.2 * inch))

    contact_data = [
        [Paragraph("FOUNDER", contact_label),
         Paragraph("Mona Jackson-Ham", contact_value)],
        [Paragraph("COMPANIES", contact_label),
         Paragraph("MJUnlimited Essential Marketing<br/>"
                   "ThinkBox AI Operation Systems", contact_value)],
        [Paragraph("EMAIL", contact_label),
         Paragraph("hello@mjunlimited.com", contact_value)],
        [Paragraph("WEBSITE", contact_label),
         Paragraph("www.mjunlimited.com", contact_value)],
        [Paragraph("INSTAGRAM", contact_label),
         Paragraph("@monajacksonham", contact_value)],
        [Paragraph("INQUIRIES", contact_label),
         Paragraph("Partnerships, sponsorships, speaking, and press",
                   contact_value)],
    ]
    contact_table = Table(contact_data, colWidths=[1.6 * inch, 4.7 * inch])
    contact_table.setStyle(TableStyle([
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 0),
        ("RIGHTPADDING", (0, 0), (-1, -1), 0),
        ("TOPPADDING", (0, 0), (-1, -1), 10),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 10),
        ("LINEBELOW", (0, 0), (-1, -2), 0.5, GOLD),
    ]))
    story.append(contact_table)

    story.append(Spacer(1, 0.4 * inch))

    # Closing pull quote in a gold band
    closing_data = [[Paragraph(
        '“Where AI meets purpose, strategy, and real-world results.”',
        ParagraphStyle("Closing", fontName="Helvetica-Oblique", fontSize=15,
                       textColor=white, leading=20, alignment=TA_CENTER),
    )]]
    closing_table = Table(closing_data, colWidths=[6.3 * inch])
    closing_table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, -1), PLUM),
        ("LEFTPADDING", (0, 0), (-1, -1), 24),
        ("RIGHTPADDING", (0, 0), (-1, -1), 24),
        ("TOPPADDING", (0, 0), (-1, -1), 26),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 26),
    ]))
    story.append(closing_table)

    story.append(Spacer(1, 0.2 * inch))
    story.append(Paragraph(
        "Thank you for considering a partnership with MJUnlimited &amp; ThinkBox AI.",
        ParagraphStyle("Thanks", fontName="Helvetica-Bold", fontSize=10,
                       textColor=GOLD, leading=14, alignment=TA_CENTER),
    ))

    doc.build(story)
    print(f"Generated: {OUTPUT}")


if __name__ == "__main__":
    build()
