/**
 * Translation System
 * 
 * Provides translations for English, German, and Norwegian
 * All UI strings should be defined here
 */
const translations = {
  en: {
    // Navigation
    nav: {
      vehicle: 'Vehicle',
      manuals: 'Manuals',
      reports: 'Reports',
      settings: 'Settings'
    },
    // App Bar
    appBar: {
      vehicleSelection: 'Vehicle selection'
    },
    // Vehicle Selection
    vehicleSelection: {
      chooseModel: 'Choose model:',
      chooseYear: 'Choose year:',
      chooseEngineType: 'Choose engine type:',
      selectionSummary: 'Selection summary:',
      brand: 'Brand',
      model: 'Model',
      year: 'Year',
      engineType: 'Engine Type',
      confirmSelection: 'Confirm selection',
      reset: 'Reset',
      noModelsFound: 'No models found for',
      noYearsFound: 'No years found for',
      noEngineTypesFound: 'No engine types found for',
      bannerText: 'Choose Model, Year and Engine type to proceed.',
      proTip: 'Pro tip,',
      proTipText: 'If you need help with vehicle selection, try using the photo recognition with',
      aiAssistantLink: 'AI Assistant',
      searchPlaceholder: 'VIN / VRM / Engine Code / Brand / Model ...'
    },
    // AI Assistant
    aiAssistant: {
      askBadge: 'Ask',
      titleName: 'AutoAssist',
      welcomeTitle: 'Welcome to AutoAssist',
      welcomeText: 'I\'m here to help with vehicle diagnostics, manual lookups, and troubleshooting. What can I assist you with today?',
      inputPlaceholder: 'Ask anything, find anything...',
      searching: 'Searching...',
      answering: 'Answering...',
      done: 'Done',
      newChat: 'New Chat',
      selectVehicle: 'Select vehicle',
      analyzingPhoto: 'Analyzing photo...',
      identifyingVehicle: 'Identifying vehicle...',
      processingComplete: 'Processing complete',
      photoAnalysis: 'This is a photo of',
      wouldYouLikeToSelect: 'Would you like to select this vehicle for VCI connection?',
      photoCaptured: 'Photo captured!',
      filters: {
        web: 'Web',
        videos: 'Videos',
        manuals: 'Manuals'
      },
      ariaLabels: {
        expand: 'Expand to full screen',
        close: 'Close AI assistant',
        uploadImage: 'Upload image',
        voiceInput: 'Voice input',
        sendMessage: 'Send message',
        takePhoto: 'Take photo',
        startNewChat: 'Start new chat'
      },
      // Search Results Content
      searchResults: {
        web: {
          summaryTitle: 'Common Engine Problems in Fiat Cars',
          summaryBullets: [
            'High oil consumption in T5 and T6 Drive-E engines (2011-2020)',
            'Timing chain and tensioner failures in multiple engine types',
            'Fuel system and injector problems affecting performance',
            'Overheating issues due to cooling system malfunctions'
          ],
          summaryParagraphs: [
            'Fiat engines are generally reliable but have recurring issues, particularly in certain models and engine types. High oil consumption affects T5 and T6 Drive-E engines (2011-2020) due to faulty piston rings.',
            'Regular oil checks and synthetic oil use can help prevent damage. A worn tensioner can cause misalignment and catastrophic engine failure if not replaced early.'
          ],
          results: [
            {
              title: 'Common Engine Problems in Fiat Cars',
              snippet: 'Fiat engines are generally reliable but have recurring issues, particularly in certain models and engine types. High oil consumption affects T5 and T6 Drive-E engines (2011-2020) due to faulty piston rings.'
            },
            {
              title: 'Fiat Engine Diagnostic Procedures',
              snippet: 'Step-by-step diagnostic procedures for common Fiat engine issues including timing chain problems and fuel system diagnostics.'
            }
          ]
        },
        manuals: {
          summaryTitle: 'Official Fiat Service Documentation',
          summaryBullets: [
            'Manufacturer-approved diagnostic procedures',
            'Official service bulletins and technical notes',
            'Factory-recommended repair methods',
            'Warranty-covered component information'
          ],
          summaryParagraphs: [
            'Based on official Fiat service documentation, here are the manufacturer-approved procedures for addressing common engine problems. These methods are covered under warranty and follow factory specifications.'
          ],
          results: [
            {
              title: 'Fiat Service Manual - Engine Diagnostics',
              snippet: 'Official Fiat service procedures for engine diagnostic testing and troubleshooting common issues.'
            },
            {
              title: 'Fiat Technical Bulletin - Oil Consumption',
              snippet: 'Manufacturer-approved procedures for addressing excessive oil consumption in Drive-E engines.'
            }
          ]
        },
        videos: {
          summaryBullets: [
            'Complete video tutorials for Fiat 500 {problem}',
            'Professional mechanic demonstrations',
            'Step-by-step repair procedures',
            'Common problem identification guides'
          ],
          summaryParagraphs: [
            'I found comprehensive video resources that will help you understand and fix Fiat 500 {problem}. These tutorials provide visual guidance for diagnostic procedures and repairs.'
          ]
        },
        modal: {
          closeContent: 'Close content',
          web: {
            fullArticleTitle: 'Full Article Content',
            fullArticleIntro: 'This is a comprehensive article about {title}. The content covers detailed information about the topic, including:',
            fullArticleBullets: [
              'Technical specifications and requirements',
              'Step-by-step procedures and instructions',
              'Common issues and troubleshooting steps',
              'Best practices and recommendations'
            ],
            fullArticleConclusion: 'The article provides in-depth analysis and practical solutions for automotive professionals and enthusiasts.',
            technicalAnalysis: 'Technical Analysis',
            technicalAnalysisText: 'Modern automotive engines face numerous challenges in today\'s complex vehicle systems. The integration of electronic control units (ECUs) with traditional mechanical components creates unique diagnostic scenarios that require specialized knowledge and tools.',
            diagnosticProcedures: 'Diagnostic Procedures',
            diagnosticProceduresText: 'When approaching engine problems, technicians should follow a systematic diagnostic approach:',
            diagnosticSteps: [
              'Visual inspection of engine components and connections',
              'Scan tool diagnostics to identify fault codes',
              'Component testing using appropriate test equipment',
              'Data analysis and interpretation of test results',
              'Repair verification and system testing'
            ],
            commonIssues: 'Common Engine Issues',
            commonIssuesText: 'Engine problems can manifest in various ways, from subtle performance issues to complete failure. Understanding the root causes and symptoms is crucial for effective diagnosis and repair.',
            prevention: 'Prevention and Maintenance',
            preventionText: 'Regular maintenance and proper care can prevent many engine problems. Following manufacturer recommendations for service intervals and using quality parts and fluids is essential for long-term reliability.',
            advancedDiagnostics: 'Advanced Diagnostics',
            advancedDiagnosticsText: 'Modern diagnostic equipment provides technicians with powerful tools for identifying and resolving engine issues. Understanding how to use these tools effectively is key to successful repairs.'
          },
          manuals: {
            officialServiceManual: 'Official Service Manual',
            version: 'Version 2.1.3',
            overview: 'Overview',
            technicalReference: 'Technical Reference',
            figureBallast: '[Figure 4-3: Ballast Resistor Circuit Diagram]',
            figureBallastDesc: 'Ballast resistor used in some ignition primary wiring circuits. Shows starting bypass and primary resistor configuration for proper coil operation.',
            requiredTools: 'Required Tools',
            tools: [
              'Diagnostic scanner',
              'Multimeter',
              'Service manual',
              'Safety equipment'
            ],
            procedureSteps: 'Procedure Steps',
            procedureStepItems: [
              'Connect diagnostic equipment',
              'Perform initial system check',
              'Follow manufacturer procedures',
              'Document findings and results'
            ],
            wiringReference: 'Wiring Reference',
            figureSparkPlug: '[Figure 4-4: Spark Plug Wire Cross-Section]',
            figureSparkPlugDesc: 'Typical spark plug wire construction showing core, insulation, glass/cotton braid, and jacket materials (hypalon normal, silicon high temperature).',
            safetyPrecautions: 'Safety Precautions',
            safetyPrecautionsText: 'Before beginning any diagnostic procedure, ensure all safety protocols are followed. This includes proper personal protective equipment, vehicle stabilization, and electrical safety measures.',
            safetyItems: [
              'Wear appropriate safety glasses and gloves',
              'Ensure vehicle is properly supported',
              'Disconnect battery before electrical work',
              'Follow lockout/tagout procedures'
            ],
            technicalSpecs: 'Technical Specifications',
            technicalSpecsText: 'Refer to the following specifications when performing diagnostic procedures:',
            specs: [
              'Engine displacement: 1.4L - 2.0L',
              'Compression ratio: 10:1 - 12:1',
              'Fuel system: Direct injection',
              'Ignition system: Coil-on-plug'
            ],
            connectorReference: 'Connector Reference',
            connectorReferenceDesc: 'Figure 4-10: Multiple-wire hard shell connectors showing Amp, locking wedge, tang, internal locking finger, blade, and printed circuit connector types with their respective locking mechanisms.',
            troubleshooting: 'Troubleshooting Guide',
            troubleshootingText: 'Common issues and their diagnostic approaches:',
            troubleshootingItems: [
              'Engine misfire: Check ignition system and fuel delivery',
              'Poor fuel economy: Inspect air filter and fuel system'
            ]
          },
          buttons: {
            openFullArticle: 'Open Full Article',
            saveForLater: 'Save for Later',
            downloadPdf: 'Download PDF',
            printSection: 'Print Section',
            viewFullContent: 'View Full Content'
          }
        }
      }
    },
    // Action Buttons
    actions: {
      autoDetect: 'Auto detect',
      captureVIN: 'Capture VIN',
      search: 'Search',
      history: 'History'
    },
    // VCI Indicator
    vci: {
      noVci: 'No VCI',
      connecting: 'Connecting...',
      connected: 'VCI Connected',
      disconnected: 'VCI Disconnected',
      lowBattery: 'Low Battery',
      runningDiagnostics: 'Running Diagnostics'
    },
    // Brand Card Tags
    brandTag: {
      new: 'New'
    },
    // Password Gate
    passwordGate: {
      title: 'Enter Password',
      description: 'This prototype is password protected. Please enter the password to continue.',
      placeholder: 'Password',
      submit: 'Enter',
      error: 'Incorrect password. Please try again.'
    }
  },
  de: {
    // Navigation
    nav: {
      vehicle: 'Fahrzeug',
      manuals: 'Handbuch',
      reports: 'Berichte',
      settings: 'Einstellung'
    },
    // App Bar
    appBar: {
      vehicleSelection: 'Fahrzeugauswahl'
    },
    // Vehicle Selection
    vehicleSelection: {
      chooseModel: 'Modell wählen:',
      chooseYear: 'Jahr wählen:',
      chooseEngineType: 'Motortyp wählen:',
      selectionSummary: 'Auswahlübersicht:',
      brand: 'Marke',
      model: 'Modell',
      year: 'Jahr',
      engineType: 'Motortyp',
      confirmSelection: 'Auswahl bestätigen',
      reset: 'Zurücksetzen',
      noModelsFound: 'Keine Modelle gefunden für',
      noYearsFound: 'Keine Jahre gefunden für',
      noEngineTypesFound: 'Keine Motortypen gefunden für',
      bannerText: 'Wählen Sie Modell, Jahr und Motortyp, um fortzufahren.',
      proTip: 'Profi-Tipp,',
      proTipText: 'Wenn Sie Hilfe bei der Fahrzeugauswahl benötigen, versuchen Sie die Fotoerkennung mit',
      aiAssistantLink: 'KI-Assistenten',
      searchPlaceholder: 'FIN / VRM / Motorkennung / Marke / Modell ...'
    },
    // AI Assistant
    aiAssistant: {
      askBadge: 'Fragen',
      titleName: 'AutoAssist',
      welcomeTitle: 'Willkommen bei AutoAssist',
      welcomeText: 'Ich bin hier, um bei Fahrzeugdiagnose, Handbuchsuche und Fehlerbehebung zu helfen. Womit kann ich Ihnen heute helfen?',
      inputPlaceholder: 'Fragen Sie alles, finden Sie alles...',
      searching: 'Suche...',
      answering: 'Antworte...',
      done: 'Fertig',
      newChat: 'Neuer Chat',
      selectVehicle: 'Fahrzeug auswählen',
      analyzingPhoto: 'Foto wird analysiert...',
      identifyingVehicle: 'Fahrzeug wird identifiziert...',
      processingComplete: 'Verarbeitung abgeschlossen',
      photoAnalysis: 'Dies ist ein Foto von',
      wouldYouLikeToSelect: 'Möchten Sie dieses Fahrzeug für die VCI-Verbindung auswählen?',
      photoCaptured: 'Foto aufgenommen!',
      filters: {
        web: 'Web',
        videos: 'Videos',
        manuals: 'Handbücher'
      },
      ariaLabels: {
        expand: 'Auf Vollbild erweitern',
        close: 'KI-Assistent schließen',
        uploadImage: 'Bild hochladen',
        voiceInput: 'Spracheingabe',
        sendMessage: 'Nachricht senden',
        takePhoto: 'Foto aufnehmen',
        startNewChat: 'Neuen Chat starten'
      },
      // Search Results Content
      searchResults: {
        web: {
          summaryTitle: 'Häufige Motorprobleme bei Fiat-Fahrzeugen',
          summaryBullets: [
            'Hoher Ölverbrauch in T5- und T6-Drive-E-Motoren (2011-2020)',
            'Zahnriemen- und Spannerausfälle bei mehreren Motortypen',
            'Kraftstoffsystem- und Einspritzprobleme, die die Leistung beeinträchtigen',
            'Überhitzungsprobleme aufgrund von Kühlsystemstörungen'
          ],
          summaryParagraphs: [
            'Fiat-Motoren sind im Allgemeinen zuverlässig, haben aber wiederkehrende Probleme, insbesondere bei bestimmten Modellen und Motortypen. Hoher Ölverbrauch betrifft T5- und T6-Drive-E-Motoren (2011-2020) aufgrund fehlerhafter Kolbenringe.',
            'Regelmäßige Ölkontrollen und die Verwendung von Synthetiköl können helfen, Schäden zu vermeiden. Ein abgenutzter Spanner kann Fehlausrichtung und katastrophalen Motorschaden verursachen, wenn er nicht frühzeitig ersetzt wird.'
          ],
          results: [
            {
              title: 'Häufige Motorprobleme bei Fiat-Fahrzeugen',
              snippet: 'Fiat-Motoren sind im Allgemeinen zuverlässig, haben aber wiederkehrende Probleme, insbesondere bei bestimmten Modellen und Motortypen. Hoher Ölverbrauch betrifft T5- und T6-Drive-E-Motoren (2011-2020) aufgrund fehlerhafter Kolbenringe.'
            },
            {
              title: 'Fiat-Motordiagnoseverfahren',
              snippet: 'Schritt-für-Schritt-Diagnoseverfahren für häufige Fiat-Motorprobleme, einschließlich Zahnriemenprobleme und Kraftstoffsystemdiagnose.'
            }
          ]
        },
        manuals: {
          summaryTitle: 'Offizielle Fiat-Servicedokumentation',
          summaryBullets: [
            'Herstellergenehmigte Diagnoseverfahren',
            'Offizielle Servicebulletins und technische Notizen',
            'Werkseitig empfohlene Reparaturmethoden',
            'Garantieabgedeckte Komponenteninformationen'
          ],
          summaryParagraphs: [
            'Basierend auf offizieller Fiat-Servicedokumentation finden Sie hier die herstellergenehmigten Verfahren zur Behandlung häufiger Motorprobleme. Diese Methoden sind garantiert abgedeckt und folgen Werkspezifikationen.'
          ],
          results: [
            {
              title: 'Fiat-Servicehandbuch - Motordiagnose',
              snippet: 'Offizielle Fiat-Serviceverfahren für Motordiagnosetests und Fehlerbehebung bei häufigen Problemen.'
            },
            {
              title: 'Fiat-Technisches Bulletin - Ölverbrauch',
              snippet: 'Herstellergenehmigte Verfahren zur Behandlung von übermäßigem Ölverbrauch in Drive-E-Motoren.'
            }
          ]
        },
        videos: {
          summaryBullets: [
            'Vollständige Videoanleitungen für Fiat 500 {problem}',
            'Professionelle Mechaniker-Demonstrationen',
            'Schritt-für-Schritt-Reparaturverfahren',
            'Anleitungen zur Identifizierung häufiger Probleme'
          ],
          summaryParagraphs: [
            'Ich habe umfassende Videoresourcen gefunden, die Ihnen helfen werden, Fiat 500 {problem} zu verstehen und zu beheben. Diese Tutorials bieten visuelle Anleitung für Diagnoseverfahren und Reparaturen.'
          ]
        },
        modal: {
          closeContent: 'Inhalt schließen',
          web: {
            fullArticleTitle: 'Vollständiger Artikelinhalt',
            fullArticleIntro: 'Dies ist ein umfassender Artikel über {title}. Der Inhalt deckt detaillierte Informationen zum Thema ab, einschließlich:',
            fullArticleBullets: [
              'Technische Spezifikationen und Anforderungen',
              'Schritt-für-Schritt-Verfahren und Anweisungen',
              'Häufige Probleme und Fehlerbehebungsschritte',
              'Best Practices und Empfehlungen'
            ],
            fullArticleConclusion: 'Der Artikel bietet eingehende Analysen und praktische Lösungen für Automobilfachleute und Enthusiasten.',
            technicalAnalysis: 'Technische Analyse',
            technicalAnalysisText: 'Moderne Automotoren stehen vor zahlreichen Herausforderungen in den komplexen Fahrzeugsystemen von heute. Die Integration von elektronischen Steuergeräten (ECUs) mit traditionellen mechanischen Komponenten schafft einzigartige Diagnoseszenarien, die spezialisiertes Wissen und Werkzeuge erfordern.',
            diagnosticProcedures: 'Diagnoseverfahren',
            diagnosticProceduresText: 'Bei der Behandlung von Motorproblemen sollten Techniker einen systematischen Diagnoseansatz verfolgen:',
            diagnosticSteps: [
              'Visuelle Inspektion von Motorkomponenten und Verbindungen',
              'Diagnosegerät-Scans zur Identifizierung von Fehlercodes',
              'Komponententests mit geeigneter Testausrüstung',
              'Datenanalyse und Interpretation von Testergebnissen',
              'Reparaturverifizierung und Systemtests'
            ],
            commonIssues: 'Häufige Motorprobleme',
            commonIssuesText: 'Motorprobleme können sich auf verschiedene Weise manifestieren, von subtilen Leistungsproblemen bis hin zum vollständigen Ausfall. Das Verständnis der Ursachen und Symptome ist entscheidend für eine effektive Diagnose und Reparatur.',
            prevention: 'Vorbeugung und Wartung',
            preventionText: 'Regelmäßige Wartung und ordnungsgemäße Pflege können viele Motorprobleme verhindern. Die Einhaltung der Herstellerempfehlungen für Serviceintervalle und die Verwendung von Qualitätsteilen und -flüssigkeiten ist für langfristige Zuverlässigkeit unerlässlich.',
            advancedDiagnostics: 'Erweiterte Diagnose',
            advancedDiagnosticsText: 'Moderne Diagnosegeräte bieten Technikern leistungsstarke Werkzeuge zur Identifizierung und Lösung von Motorproblemen. Das Verständnis, wie diese Werkzeuge effektiv eingesetzt werden, ist der Schlüssel zu erfolgreichen Reparaturen.'
          },
          manuals: {
            officialServiceManual: 'Offizielles Servicehandbuch',
            version: 'Version 2.1.3',
            overview: 'Übersicht',
            technicalReference: 'Technische Referenz',
            figureBallast: '[Abbildung 4-3: Vorwiderstand-Schaltplan]',
            figureBallastDesc: 'Vorwiderstand, der in einigen Zündungsprimärschaltungen verwendet wird. Zeigt Startbypass und Primärwiderstandskonfiguration für ordnungsgemäßen Spulenbetrieb.',
            requiredTools: 'Erforderliche Werkzeuge',
            tools: [
              'Diagnosescanner',
              'Multimeter',
              'Servicehandbuch',
              'Sicherheitsausrüstung'
            ],
            procedureSteps: 'Verfahrensschritte',
            procedureStepItems: [
              'Diagnosegerät anschließen',
              'Erste Systemprüfung durchführen',
              'Herstellerverfahren befolgen',
              'Befunde und Ergebnisse dokumentieren'
            ],
            wiringReference: 'Verkabelungsreferenz',
            figureSparkPlug: '[Abbildung 4-4: Zündkerzenkabel-Querschnitt]',
            figureSparkPlugDesc: 'Typische Zündkerzenkabelkonstruktion mit Kern, Isolierung, Glas-/Baumwollgeflecht und Mantelmaterialien (Hypalon normal, Silikon Hochtemperatur).',
            safetyPrecautions: 'Sicherheitsvorkehrungen',
            safetyPrecautionsText: 'Vor Beginn eines Diagnoseverfahrens sicherstellen, dass alle Sicherheitsprotokolle befolgt werden. Dies umfasst ordnungsgemäße persönliche Schutzausrüstung, Fahrzeugstabilisierung und elektrische Sicherheitsmaßnahmen.',
            safetyItems: [
              'Angemessene Schutzbrille und Handschuhe tragen',
              'Sicherstellen, dass das Fahrzeug ordnungsgemäß unterstützt ist',
              'Batterie vor elektrischen Arbeiten trennen',
              'Sperr-/Kennzeichnungsverfahren befolgen'
            ],
            technicalSpecs: 'Technische Spezifikationen',
            technicalSpecsText: 'Bei der Durchführung von Diagnoseverfahren auf folgende Spezifikationen verweisen:',
            specs: [
              'Hubraum: 1,4L - 2,0L',
              'Verdichtungsverhältnis: 10:1 - 12:1',
              'Kraftstoffsystem: Direkteinspritzung',
              'Zündsystem: Zündspule auf Stecker'
            ],
            connectorReference: 'Steckerreferenz',
            connectorReferenceDesc: 'Abbildung 4-10: Mehrdrahtige Hartschalenstecker mit Amp-, Verriegelungskeil-, Tang-, internem Verriegelungsfinger-, Klingen- und Leiterplattensteckertypen mit ihren jeweiligen Verriegelungsmechanismen.',
            troubleshooting: 'Fehlerbehebungsanleitung',
            troubleshootingText: 'Häufige Probleme und ihre Diagnoseansätze:',
            troubleshootingItems: [
              'Motoraussetzer: Zündsystem und Kraftstoffzufuhr prüfen',
              'Schlechter Kraftstoffverbrauch: Luftfilter und Kraftstoffsystem inspizieren'
            ]
          },
          buttons: {
            openFullArticle: 'Vollständigen Artikel öffnen',
            saveForLater: 'Für später speichern',
            downloadPdf: 'PDF herunterladen',
            printSection: 'Abschnitt drucken',
            viewFullContent: 'Vollständigen Inhalt anzeigen'
          }
        }
      }
    },
    // Action Buttons
    actions: {
      autoDetect: 'Automatisch erkennen',
      captureVIN: 'VIN erfassen',
      search: 'Suchen',
      history: 'Verlauf'
    },
    // VCI Indicator
    vci: {
      noVci: 'Kein VCI',
      connecting: 'Verbinde...',
      connected: 'VCI Verbunden',
      disconnected: 'VCI Getrennt',
      lowBattery: 'Niedrige Batterie',
      runningDiagnostics: 'Diagnose läuft'
    },
    // Brand Card Tags
    brandTag: {
      new: 'Neu'
    },
    // Password Gate
    passwordGate: {
      title: 'Passwort eingeben',
      description: 'Dieser Prototyp ist passwortgeschützt. Bitte geben Sie das Passwort ein, um fortzufahren.',
      placeholder: 'Passwort',
      submit: 'Eingabe',
      error: 'Falsches Passwort. Bitte versuchen Sie es erneut.'
    }
  },
  no: {
    // Navigation
    nav: {
      vehicle: 'Kjøretøy',
      manuals: 'Håndbok',
      reports: 'Rapporter',
      settings: 'Innstillinger'
    },
    // App Bar
    appBar: {
      vehicleSelection: 'Kjøretøyvalg'
    },
    // Vehicle Selection
    vehicleSelection: {
      chooseModel: 'Velg modell:',
      chooseYear: 'Velg år:',
      chooseEngineType: 'Velg motortype:',
      selectionSummary: 'Valgoversikt:',
      brand: 'Merke',
      model: 'Modell',
      year: 'År',
      engineType: 'Motortype',
      confirmSelection: 'Bekreft valg',
      reset: 'Tilbakestill',
      noModelsFound: 'Ingen modeller funnet for',
      noYearsFound: 'Ingen år funnet for',
      noEngineTypesFound: 'Ingen motortyper funnet for',
      bannerText: 'Velg Modell, År og Motortype for å fortsette.',
      proTip: 'Pro-tips,',
      proTipText: 'Hvis du trenger hjelp med kjøretøyvalg, prøv å bruke foto-gjenkjenning med',
      aiAssistantLink: 'KI-assistenten',
      searchPlaceholder: 'VIN / VRM / Motorkode / Merke / Modell ...'
    },
    // AI Assistant
    aiAssistant: {
      askBadge: 'Spør',
      titleName: 'AutoAssist',
      welcomeTitle: 'Velkommen til AutoAssist',
      welcomeText: 'Jeg er her for å hjelpe med kjøretøydiagnostikk, oppslag i håndbøker og feilsøking. Hva kan jeg hjelpe deg med i dag?',
      inputPlaceholder: 'Spør om hva som helst, finn hva som helst...',
      searching: 'Søker...',
      answering: 'Svarer...',
      done: 'Ferdig',
      newChat: 'Ny chat',
      selectVehicle: 'Velg kjøretøy',
      analyzingPhoto: 'Analyserer foto...',
      identifyingVehicle: 'Identifiserer kjøretøy...',
      processingComplete: 'Behandling fullført',
      photoAnalysis: 'Dette er et bilde av',
      wouldYouLikeToSelect: 'Vil du velge dette kjøretøyet for VCI-tilkobling?',
      photoCaptured: 'Foto tatt!',
      filters: {
        web: 'Web',
        videos: 'Videoer',
        manuals: 'Håndbøker'
      },
      ariaLabels: {
        expand: 'Utvid til fullskjerm',
        close: 'Lukk KI-assistent',
        uploadImage: 'Last opp bilde',
        voiceInput: 'Stemmeinndata',
        sendMessage: 'Send melding',
        takePhoto: 'Ta bilde',
        startNewChat: 'Start ny chat'
      },
      // Search Results Content
      searchResults: {
        web: {
          summaryTitle: 'Vanlige motorproblemer i Fiat-biler',
          summaryBullets: [
            'Høy oljeforbruk i T5 og T6 Drive-E motorer (2011-2020)',
            'Tidkjedekjede- og spennarfeil i flere motortyper',
            'Drivstoffsystem- og innsprøytingsproblemer som påvirker ytelsen',
            'Overopphetingsproblemer på grunn av kjølesystemfeil'
          ],
          summaryParagraphs: [
            'Fiat-motorer er generelt pålitelige, men har tilbakevendende problemer, spesielt i visse modeller og motortyper. Høy oljeforbruk påvirker T5 og T6 Drive-E motorer (2011-2020) på grunn av defekte stempelringer.',
            'Regelmessige oljekontroller og bruk av syntetisk olje kan bidra til å forhindre skader. En slitt spenner kan forårsake feiljustering og katastrofal motorsvikt hvis den ikke erstattes tidlig.'
          ],
          results: [
            {
              title: 'Vanlige motorproblemer i Fiat-biler',
              snippet: 'Fiat-motorer er generelt pålitelige, men har tilbakevendende problemer, spesielt i visse modeller og motortyper. Høy oljeforbruk påvirker T5 og T6 Drive-E motorer (2011-2020) på grunn av defekte stempelringer.'
            },
            {
              title: 'Fiat-motordiagnoseprosedyrer',
              snippet: 'Trinn-for-trinn diagnoseprosedyrer for vanlige Fiat-motorproblemer, inkludert tidkjedeproblemer og drivstoffsystemdiagnostikk.'
            }
          ]
        },
        manuals: {
          summaryTitle: 'Offisiell Fiat-servicedokumentasjon',
          summaryBullets: [
            'Produsentgodkjente diagnoseprosedyrer',
            'Offisielle servicebulletiner og tekniske notater',
            'Fabrikkanbefalte reparasjonsmetoder',
            'Garantidekket komponentinformasjon'
          ],
          summaryParagraphs: [
            'Basert på offisiell Fiat-servicedokumentasjon, her er de produsentgodkjente prosedyrene for å håndtere vanlige motorproblemer. Disse metodene er dekket av garanti og følger fabrikkspesifikasjoner.'
          ],
          results: [
            {
              title: 'Fiat-servicehåndbok - Motordiagnostikk',
              snippet: 'Offisielle Fiat-serviceprosedyrer for motordiagnostisk testing og feilsøking av vanlige problemer.'
            },
            {
              title: 'Fiat-teknisk bulletin - Oljeforbruk',
              snippet: 'Produsentgodkjente prosedyrer for å håndtere overdrevent oljeforbruk i Drive-E motorer.'
            }
          ]
        },
        videos: {
          summaryBullets: [
            'Komplette videoopplæringer for Fiat 500 {problem}',
            'Profesjonelle mekaniker-demonstrasjoner',
            'Trinn-for-trinn reparasjonsprosedyrer',
            'Veiledninger for identifikasjon av vanlige problemer'
          ],
          summaryParagraphs: [
            'Jeg fant omfattende videoresurser som vil hjelpe deg med å forstå og fikse Fiat 500 {problem}. Disse opplæringene gir visuell veiledning for diagnoseprosedyrer og reparasjoner.'
          ]
        },
        modal: {
          closeContent: 'Lukk innhold',
          web: {
            fullArticleTitle: 'Full artikkelinnhold',
            fullArticleIntro: 'Dette er en omfattende artikkel om {title}. Innholdet dekker detaljert informasjon om emnet, inkludert:',
            fullArticleBullets: [
              'Tekniske spesifikasjoner og krav',
              'Trinn-for-trinn prosedyrer og instruksjoner',
              'Vanlige problemer og feilsøkingssteg',
              'Beste praksis og anbefalinger'
            ],
            fullArticleConclusion: 'Artikkelen gir grundige analyser og praktiske løsninger for bilfagfolk og entusiaster.',
            technicalAnalysis: 'Teknisk analyse',
            technicalAnalysisText: 'Moderne bilmotorer står overfor mange utfordringer i dagens komplekse kjøretøysystemer. Integreringen av elektroniske styreenheter (ECU-er) med tradisjonelle mekaniske komponenter skaper unike diagnosescenarier som krever spesialisert kunnskap og verktøy.',
            diagnosticProcedures: 'Diagnoseprosedyrer',
            diagnosticProceduresText: 'Når man nærmer seg motorproblemer, bør teknikere følge en systematisk diagnostisk tilnærming:',
            diagnosticSteps: [
              'Visuell inspeksjon av motorkomponenter og tilkoblinger',
              'Skanningsverktøy-diagnostikk for å identifisere feilkoder',
              'Komponenttesting med passende testutstyr',
              'Dataanalyse og tolkning av testresultater',
              'Reparasjonsverifisering og systemtesting'
            ],
            commonIssues: 'Vanlige motorproblemer',
            commonIssuesText: 'Motorproblemer kan manifestere seg på ulike måter, fra subtile ytelsesproblemer til fullstendig svikt. Å forstå årsakene og symptomene er avgjørende for effektiv diagnostikk og reparasjon.',
            prevention: 'Forebygging og vedlikehold',
            preventionText: 'Regelmessig vedlikehold og riktig stell kan forhindre mange motorproblemer. Å følge produsentens anbefalinger for serviceintervaller og bruke kvalitetsdeler og væsker er avgjørende for langsiktig pålitelighet.',
            advancedDiagnostics: 'Avansert diagnostikk',
            advancedDiagnosticsText: 'Moderne diagnostisk utstyr gir teknikere kraftige verktøy for å identifisere og løse motorproblemer. Å forstå hvordan man bruker disse verktøyene effektivt er nøkkelen til vellykkede reparasjoner.'
          },
          manuals: {
            officialServiceManual: 'Offisiell servicehåndbok',
            version: 'Versjon 2.1.3',
            overview: 'Oversikt',
            technicalReference: 'Teknisk referanse',
            figureBallast: '[Figur 4-3: Ballastmotstand-kretsdiagram]',
            figureBallastDesc: 'Ballastmotstand brukt i noen tenning primærkabler. Viser startbypass og primærmotstandskonfigurasjon for riktig spoloperasjon.',
            requiredTools: 'Påkrevde verktøy',
            tools: [
              'Diagnostisk skanner',
              'Multimeter',
              'Servicehåndbok',
              'Sikkerhetsutstyr'
            ],
            procedureSteps: 'Prosedyretrinn',
            procedureStepItems: [
              'Koble til diagnostisk utstyr',
              'Utfør innledende systemkontroll',
              'Følg produsentprosedyrer',
              'Dokumenter funn og resultater'
            ],
            wiringReference: 'Kabelreferanse',
            figureSparkPlug: '[Figur 4-4: Tennespluggledning-tverrsnitt]',
            figureSparkPlugDesc: 'Typisk tennepluggledningskonstruksjon som viser kjerne, isolasjon, glass/bomullsfletting og mantelmaterialer (hypalon normal, silikon høy temperatur).',
            safetyPrecautions: 'Sikkerhetsforholdsregler',
            safetyPrecautionsText: 'Før du begynner på noen diagnostisk prosedyre, sørg for at alle sikkerhetsprotokoller følges. Dette inkluderer riktig personlig verneutstyr, kjøretøystabilisering og elektriske sikkerhetstiltak.',
            safetyItems: [
              'Bruk passende sikkerhetsbriller og hansker',
              'Sørg for at kjøretøyet er riktig støttet',
              'Koble fra batteriet før elektrisk arbeid',
              'Følg sperre/merking-prosedyrer'
            ],
            technicalSpecs: 'Tekniske spesifikasjoner',
            technicalSpecsText: 'Se følgende spesifikasjoner når du utfører diagnostiske prosedyrer:',
            specs: [
              'Motorslagsvolum: 1,4L - 2,0L',
              'Kompresjonsforhold: 10:1 - 12:1',
              'Drivstoffsystem: Direkteinnsprøytning',
              'Tenningssystem: Spole på plugg'
            ],
            connectorReference: 'Koblingsreferanse',
            connectorReferenceDesc: 'Figur 4-10: Flertrådige harde skallkoblinger som viser Amp, låsende kile, tang, intern låsende finger, blad og trykt kretskoblingstyper med sine respektive låsemekanismer.',
            troubleshooting: 'Feilsøkingsveiledning',
            troubleshootingText: 'Vanlige problemer og deres diagnostiske tilnærminger:',
            troubleshootingItems: [
              'Motorfeil: Sjekk tenningssystem og drivstofflevering',
              'Dårlig drivstofføkonomi: Inspiser luftfilter og drivstoffsystem'
            ]
          },
          buttons: {
            openFullArticle: 'Åpne full artikkel',
            saveForLater: 'Lagre for senere',
            downloadPdf: 'Last ned PDF',
            printSection: 'Skriv ut seksjon',
            viewFullContent: 'Vis fullt innhold'
          }
        }
      }
    },
    // Action Buttons
    actions: {
      autoDetect: 'Auto-oppdag',
      captureVIN: 'Fang VIN',
      search: 'Søk',
      history: 'Historikk'
    },
    // VCI Indicator
    vci: {
      noVci: 'Ingen VCI',
      connecting: 'Kobler til...',
      connected: 'VCI Koblet til',
      disconnected: 'VCI Koblet fra',
      lowBattery: 'Lavt batteri',
      runningDiagnostics: 'Kjører diagnostikk'
    },
    // Brand Card Tags
    brandTag: {
      new: 'Ny'
    },
    // Password Gate
    passwordGate: {
      title: 'Skriv inn passord',
      description: 'Denne prototypen er passordbeskyttet. Vennligst skriv inn passordet for å fortsette.',
      placeholder: 'Passord',
      submit: 'Send',
      error: 'Feil passord. Vennligst prøv igjen.'
    }
  }
};

/**
 * Translation function
 * @param {string} key - Translation key (e.g., 'nav.vehicle')
 * @param {string} lang - Language code (default: current language)
 * @returns {string} Translated text
 */
function t(key, lang = null) {
  const currentLang = lang || (window.currentLanguage || 'en');
  const keys = key.split('.');
  let value = translations[currentLang];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      console.warn(`Translation missing for key: ${key} in language: ${currentLang}`);
      // Fallback to English
      value = translations.en;
      for (const k2 of keys) {
        if (value && typeof value === 'object' && k2 in value) {
          value = value[k2];
        } else {
          return key; // Return key if translation not found
        }
      }
      break;
    }
  }
  
  return typeof value === 'string' ? value : key;
}

/**
 * Update all translatable elements in the DOM
 */
function updateTranslations(lang = null) {
  const currentLang = lang || (window.currentLanguage || 'en');
  window.currentLanguage = currentLang;
  
  // Update elements with data-i18n attribute
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.getAttribute('data-i18n');
    const translation = t(key, currentLang);
    
    // Handle different element types
    if (element.tagName === 'INPUT' && element.type === 'text') {
      element.value = translation;
    } else if (element.hasAttribute('placeholder')) {
      element.placeholder = translation;
    } else {
      element.textContent = translation;
    }
  });
  
  // Update aria-label attributes
  document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
    const key = element.getAttribute('data-i18n-aria-label');
    const translation = t(key, currentLang);
    element.setAttribute('aria-label', translation);
  });
  
  // Update placeholder attributes
  document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
    const key = element.getAttribute('data-i18n-placeholder');
    const translation = t(key, currentLang);
    element.setAttribute('placeholder', translation);
  });
  
  // Update HTML lang attribute
  document.documentElement.setAttribute('lang', currentLang);
  
  // Dispatch event for components that need to update
  document.dispatchEvent(new CustomEvent('languageChanged', {
    detail: { language: currentLang }
  }));
}

// Initialize translations on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    const storedLang = localStorage.getItem('selectedLanguage') || 'en';
    updateTranslations(storedLang);
  });
} else {
  const storedLang = localStorage.getItem('selectedLanguage') || 'en';
  updateTranslations(storedLang);
}

// Export for use in other scripts
window.translations = translations;
window.t = t;
window.updateTranslations = updateTranslations;

