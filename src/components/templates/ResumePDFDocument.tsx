import * as React from 'react'
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from '@react-pdf/renderer'
import Html from 'react-pdf-html'
import { Profile, StyleConfig, TemplateId, ResumeSectionKey } from '@/types/resume'

const getStyles = (templateId: TemplateId = 'craftsman', config?: StyleConfig) => {
  const isMono = templateId === 'tech-mono'
  const isSans = templateId === 'modern-minimal'
  const fontFamily = isMono ? 'Courier' : isSans ? 'Helvetica' : 'Times-Roman'
  const boldFontFamily = isMono ? 'Courier-Bold' : isSans ? 'Helvetica-Bold' : 'Times-Bold'
  
  const primaryColor = templateId === 'craftsman' ? '#A5392A' : templateId === 'tech-mono' ? '#4338ca' : '#111827'
  const secondaryColor = templateId === 'modern-minimal' ? '#4b5563' : '#6E6355'
  const textColor = '#1f2937'

  const headerAlign = templateId === 'executive-serif' ? 'center' : 'left'
  const sectionTitleAlign = templateId === 'executive-serif' ? 'center' : 'left'
  const sectionBorder = templateId === 'modern-minimal' ? 0 : 0.6
  
  return {
    fontFamily,
    boldFontFamily,
    styles: StyleSheet.create({
      page: {
        padding: 34,
        backgroundColor: '#FFFFFF',
        fontFamily: fontFamily,
        fontSize: templateId === 'executive-serif' ? 10 : 9.5,
        color: textColor,
        lineHeight: 1.35,
      },
      header: {
        borderBottomWidth: templateId === 'modern-minimal' ? 0 : 1.5,
        borderBottomColor: textColor,
        paddingBottom: 8,
        marginBottom: 10,
        textAlign: headerAlign,
      },
      name: {
        fontSize: 22,
        fontFamily: boldFontFamily,
        color: textColor,
        marginBottom: 6,
        lineHeight: 1.2,
      },
      title: {
        fontSize: 12,
        fontFamily: boldFontFamily,
        color: primaryColor,
        marginBottom: 8,
        lineHeight: 1.2,
      },
      contactRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: headerAlign === 'center' ? 'center' : 'flex-start',
        gap: 6,
        fontSize: 8.5,
        color: secondaryColor,
      },
      section: {
        marginBottom: 10,
      },
      sectionTitle: {
        fontSize: 10,
        fontFamily: boldFontFamily,
        textTransform: 'uppercase',
        letterSpacing: 0.8,
        color: secondaryColor,
        borderBottomWidth: sectionBorder,
        borderBottomColor: '#DED4B4',
        paddingBottom: 2,
        marginBottom: 5,
        textAlign: sectionTitleAlign,
      },
      summaryText: {
        fontSize: 9,
        color: textColor,
        fontStyle: isMono ? 'normal' : 'italic',
        lineHeight: 1.35,
      },
      itemRow: {
        marginBottom: 6,
      },
      itemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 1,
      },
      role: {
        fontSize: 9.5,
        fontFamily: boldFontFamily,
        color: textColor,
      },
      company: {
        fontSize: 9,
        color: secondaryColor,
      },
      date: {
        fontSize: 8,
        color: secondaryColor,
        fontFamily: isMono ? 'Courier' : fontFamily,
      },
      bulletRow: {
        flexDirection: 'row',
        marginBottom: 1.5,
        paddingLeft: 3,
      },
      bulletDot: {
        width: 8,
        fontSize: 8.5,
        color: primaryColor,
      },
      bulletText: {
        flex: 1,
        fontSize: 8.5,
        color: textColor,
        lineHeight: 1.3,
      },
      skillsText: {
        fontSize: 9,
        color: textColor,
        lineHeight: 1.35,
      },
    })
  }
}

interface ResumePDFDocumentProps {
  profile: Profile
  templateId?: TemplateId
  styleConfig?: StyleConfig
}

export function ResumePDFDocument({ profile, templateId, styleConfig }: ResumePDFDocumentProps) {
  const { styles, fontFamily, boldFontFamily } = getStyles(templateId, styleConfig)
  
  const sectionOrder: ResumeSectionKey[] = styleConfig?.section_order || [
    'summary',
    'experience',
    'projects',
    'education',
    'skills',
    'achievements',
  ]

  // Shared HTML stylesheet for formatting
  const htmlStylesheet = {
    p: { margin: 0, padding: 0 },
    b: { fontFamily: boldFontFamily },
    strong: { fontFamily: boldFontFamily },
    i: { fontStyle: 'italic' },
    em: { fontStyle: 'italic' },
    u: { textDecoration: 'underline' },
  }

  // Wrap strings with simple div so react-pdf-html parses them properly
  const renderHtml = (htmlString: string, baseStyle: any) => {
    return (
      <Html stylesheet={{ ...htmlStylesheet, div: baseStyle }}>
        {`<div>${htmlString}</div>`}
      </Html>
    )
  }

  const renderSection = (key: ResumeSectionKey) => {
    switch (key) {
      case 'summary':
        return profile.professional_summary ? (
          <View key="summary" style={styles.section}>
            <Text style={styles.sectionTitle}>Professional Summary</Text>
            {renderHtml(profile.professional_summary, styles.summaryText)}
          </View>
        ) : null

      case 'experience':
        return profile.work_experience && profile.work_experience.length > 0 ? (
          <View key="experience" style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {profile.work_experience.map((exp) => {
              const companyText = exp.company ? ` — ${exp.company}` : ''
              const locationText = exp.location ? ` (${exp.location})` : ''
              const hasRole = Boolean(exp.role)
              const hasCompanyOrLocation = Boolean(exp.company || exp.location)
              
              return (
                <View key={exp.id} style={styles.itemRow}>
                  <View style={styles.itemHeader}>
                    <Text>
                      {hasRole && <Text style={styles.role}>{exp.role}</Text>}
                      {hasCompanyOrLocation && (
                        <Text style={styles.company}>
                          {!hasRole && exp.company ? exp.company : companyText}
                          {locationText}
                        </Text>
                      )}
                    </Text>
                    <Text style={styles.date}>
                      {[exp.start_date, exp.current ? 'Present' : exp.end_date].filter(Boolean).join(' – ')}
                    </Text>
                  </View>

                  {exp.bullets &&
                    exp.bullets.map((bullet, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <View style={{ flex: 1 }}>
                          {renderHtml(bullet, styles.bulletText)}
                        </View>
                      </View>
                    ))}
                </View>
              )
            })}
          </View>
        ) : null

      case 'projects':
        return profile.projects && profile.projects.length > 0 ? (
          <View key="projects" style={styles.section}>
            <Text style={styles.sectionTitle}>Key Projects</Text>
            {profile.projects.map((proj) => (
              <View key={proj.id} style={styles.itemRow}>
                <Text style={styles.role}>{proj.title}</Text>
                {proj.description && (
                  <View style={{ marginTop: 2 }}>
                    {renderHtml(proj.description, styles.summaryText)}
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : null

      case 'education':
        return profile.education && profile.education.length > 0 ? (
          <View key="education" style={styles.section}>
            <Text style={styles.sectionTitle}>Education & Academic Honors</Text>
            {profile.education.map((edu) => {
              const degreeParts = [edu.degree, edu.field_of_study].filter(Boolean)
              const degreeText = degreeParts.join(' in ')
              const schoolText = edu.school ? (degreeText ? ` — ${edu.school}` : edu.school) : ''
              
              return (
                <View key={edu.id} style={styles.itemRow}>
                  <View style={styles.itemHeader}>
                    <Text>
                      {degreeText && <Text style={styles.role}>{degreeText}</Text>}
                      {schoolText && <Text style={styles.company}>{schoolText}</Text>}
                    </Text>
                    <Text style={styles.date}>
                      {[edu.start_date, edu.end_date].filter(Boolean).join(' – ')}
                    </Text>
                  </View>

                  {edu.bullets &&
                    edu.bullets.map((bullet, idx) => (
                      <View key={idx} style={styles.bulletRow}>
                        <Text style={styles.bulletDot}>•</Text>
                        <View style={{ flex: 1 }}>
                          {renderHtml(bullet, styles.bulletText)}
                        </View>
                      </View>
                    ))}
                </View>
              )
            })}
          </View>
        ) : null

      case 'skills':
        return profile.primary_skills && profile.primary_skills.length > 0 ? (
          <View key="skills" style={styles.section}>
            <Text style={styles.sectionTitle}>Key Competencies & Skills</Text>
            <Text style={styles.skillsText}>{profile.primary_skills.join('  •  ')}</Text>
          </View>
        ) : null

      case 'achievements':
        return profile.achievements && profile.achievements.length > 0 ? (
          <View key="achievements" style={styles.section}>
            <Text style={styles.sectionTitle}>Honors & Achievements</Text>
            {profile.achievements.map((ach) => {
              const issuerText = ach.issuer ? ` — ${ach.issuer}` : ''
              return (
                <View key={ach.id} style={styles.itemRow}>
                  <View style={styles.itemHeader}>
                    <Text>
                      {ach.title && <Text style={styles.role}>{ach.title}</Text>}
                      {issuerText && <Text style={styles.company}>{issuerText}</Text>}
                    </Text>
                    <Text style={styles.date}>{ach.date}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        ) : null

      default:
        return null
    }
  }

  return (
    <Document title={`${profile.full_name || 'Resume'} - Resumely`} author={profile.full_name}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.name}>{profile.full_name || 'Your Full Name'}</Text>
          {profile.title && <Text style={styles.title}>{profile.title}</Text>}
          <View style={styles.contactRow}>
            {profile.location && <Text>{profile.location}</Text>}
            {profile.phone && <Text>• {profile.phone}</Text>}
            {profile.email && <Text>• {profile.email}</Text>}
            {profile.website_url && <Text>• {profile.website_url.replace(/^https?:\/\//, '')}</Text>}
            {profile.linkedin_url && <Text>• {profile.linkedin_url.replace(/^https?:\/\//, '')}</Text>}
          </View>
        </View>

        {sectionOrder.map((key) => {
          if (styleConfig?.hidden_sections?.includes(key)) return null
          return renderSection(key)
        })}
      </Page>
    </Document>
  )
}
