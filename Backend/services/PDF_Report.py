from reportlab.platypus import (

    SimpleDocTemplate,

    Paragraph,

    Spacer

)

from reportlab.platypus import Table

from reportlab.lib.styles import getSampleStyleSheet


def generate_report(

        result,

        filename="report.pdf"

):

    doc = SimpleDocTemplate(

        filename

    )

    styles = getSampleStyleSheet()

    story = []

    story.append(

        Paragraph(

            "ScamShield AI Security Report",

            styles['Title']

        )

    )

    story.append(

        Spacer(

            1,

            20

        )

    )

    story.append(

        Paragraph(

            f"Risk Score: {result['score']}",

            styles['BodyText']

        )

    )

    story.append(

        Paragraph(

            f"Level: {result['level']}",

            styles['BodyText']

        )

    )

    story.append(

        Paragraph(

            result['explanation'],

            styles['BodyText']

        )

    )

    story.append(

        Spacer(

            1,

            20

        )

    )

    table_data = [

        [

            "Threat Indicators"

        ]

    ]

    for reason in result["reasons"]:

        table_data.append(

            [reason]

        )

    table = Table(

        table_data

    )

    story.append(

        table

    )

    doc.build(

        story

    ) 