import csv
import os

sample_fake_articles = [
    {
        "title": "BOMBSHELL: Proof High-Ranking Officials Hidden Video Shows Global Agenda",
        "text": "Shocking video leaked by anonymous whistleblower exposes secret meetings where world elites conspired to manipulate elections. The mainstream media refuses to broadcast this undeniable proof. Share this everywhere before big tech takes down this footage!",
        "subject": "News",
        "date": "December 20, 2017"
    },
    {
        "title": "WATCH: Celebrity Slams Corrupt Politicians In Live Uncensored Broadcast",
        "text": "During an impromptu live feed, prominent star went completely off-script and dropped massive truth bombs about political donors and clandestine slush funds. The network pulled the plug immediately, but we captured the entire footage right here.",
        "subject": "News",
        "date": "October 14, 2017"
    },
    {
        "title": "BREAKING: Scientists Confirm Miracle Herb Cures All Viruses Instantly",
        "text": "Big pharma executives are in sheer panic today after independent researchers discovered an ancient Himalayan root that eradicates all viral pathogens in under 24 hours. Government health agencies have ordered the report suppressed.",
        "subject": "politics",
        "date": "September 5, 2017"
    },
    {
        "title": "LEAKED EMAILS: Unsealed Documents Reveal Massive Cover-Up in Capital",
        "text": "Thousands of confidential emails published by hacktivists confirm high-level officials fabricated crime statistics to mislead voters. Not a single television station has covered this explosive revelation.",
        "subject": "Government News",
        "date": "November 11, 2016"
    },
    {
        "title": "UNBELIEVABLE: Secret Underground Bunker Discovered Beneath Historic Monument",
        "text": "Construction workers uncovered a hidden subterranean vault containing stockpiles of foreign currency and encrypted hard drives linked to former administration figures. Federal agents quickly cordoned off the perimeter.",
        "subject": "left-news",
        "date": "July 3, 2016"
    },
    {
        "title": "VIRAL PHOTO: Evidence of Staged Rally Exposed by Sharp Eyed Citizen",
        "text": "A photograph spreading like wildfire on social media shows paid actors putting on matching shirts from the back of an unmarked rental van before entering the demonstration rally. Mainstream press called it a grassroots wave.",
        "subject": "US_News",
        "date": "March 22, 2017"
    },
    {
        "title": "SHOCKING ADMISSION: Insider Confesses How State Ballots Were Swapped Overnight",
        "text": "An exclusive interview with a former voting equipment contractor reveals vulnerabilities intentionally left in vote tabulation software. Watch the full bombshell deposition before federal courts seal the testimony.",
        "subject": "News",
        "date": "January 8, 2017"
    },
    {
        "title": "MUST SEE: Secret Microchips Found in Everyday Household Appliances",
        "text": "Consumer watchdog group discovers covert tracking modules installed in smart refrigerators and microwave ovens listening to private living room conversations without homeowner consent.",
        "subject": "politics",
        "date": "May 19, 2016"
    }
]

sample_true_articles = [
    {
        "title": "Senate passes stopgap spending bill to avert government shutdown",
        "text": "WASHINGTON (Reuters) - The U.S. Senate voted 65 to 27 on Thursday to approve a short-term spending bill that will fund federal agencies through mid-January, preventing a looming shutdown of government operations. The measure now heads to the White House for the president's signature.",
        "subject": "politicsNews",
        "date": "December 21, 2017"
    },
    {
        "title": "Central bank holds benchmark interest rate steady amid cooling inflation",
        "text": "NEW YORK (Reuters) - Federal Reserve policymakers concluded a two-day monetary policy meeting by keeping the benchmark federal funds rate unchanged between 5.25% and 5.50%. Chair Jerome Powell noted that while inflation has decelerated significantly over the past year, central bankers require further evidence before initiating policy easing.",
        "subject": "politicsNews",
        "date": "November 1, 2017"
    },
    {
        "title": "European Union and Britain reach milestone agreement on trade framework",
        "text": "BRUSSELS (Reuters) - Negotiators for the European Union and the United Kingdom announced a preliminary agreement on post-Brexit trade arrangements following months of intense diplomatic talks in Brussels. The draft treaty covers mutual recognition of manufacturing standards and bilateral customs inspection protocols.",
        "subject": "worldnews",
        "date": "October 18, 2017"
    },
    {
        "title": "Supreme Court agrees to hear constitutional dispute over regulatory agency authority",
        "text": "WASHINGTON (Reuters) - The U.S. Supreme Court said on Monday it would hear oral arguments in a lawsuit challenging whether federal environmental regulators exceeded their statutory mandate under the Clean Water Act. A decision in the case is expected before the court's summer recess.",
        "subject": "politicsNews",
        "date": "September 25, 2017"
    },
    {
        "title": "State Department announces multilateral summit on regional climate resilience",
        "text": "GENEVA (Reuters) - Representatives from twenty-four nations convened in Geneva on Tuesday for the opening session of an intergovernmental conference addressing drought preparedness and disaster management across developing economies.",
        "subject": "worldnews",
        "date": "August 14, 2017"
    },
    {
        "title": "Labor Department report shows steady job growth and low unemployment rate",
        "text": "WASHINGTON (Reuters) - Nonfarm payrolls increased by 195,000 jobs last month, while the national unemployment rate held steady at 3.9%, the Bureau of Labor Statistics reported in its monthly employment situation summary on Friday morning.",
        "subject": "politicsNews",
        "date": "June 2, 2017"
    },
    {
        "title": "Health officials update seasonal vaccination guidance following committee review",
        "text": "ATLANTA (Reuters) - The Advisory Committee on Immunization Practices voted unanimously on Wednesday to recommend updated seasonal influenza formulations for adults aged 65 and older, citing clinical trial data demonstrating increased antibody response.",
        "subject": "worldnews",
        "date": "April 19, 2017"
    },
    {
        "title": "Treasury secretary meets Asian finance ministers to discuss supply chains",
        "text": "TOKYO (Reuters) - U.S. Treasury officials met with regional counterparts in Tokyo on Monday to discuss initiatives for strengthening semiconductor supply networks and modernizing port logistics infrastructure throughout the Pacific Rim.",
        "subject": "politicsNews",
        "date": "February 7, 2017"
    }
]

def create_files():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    fake_path = os.path.join(base_dir, "Fake.csv")
    true_path = os.path.join(base_dir, "True.csv")

    fields = ["title", "text", "subject", "date"]

    with open(fake_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in sample_fake_articles:
            writer.writerow(row)

    with open(true_path, mode="w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fields)
        writer.writeheader()
        for row in sample_true_articles:
            writer.writerow(row)

    print(f"Created sample {fake_path} ({len(sample_fake_articles)} records)")
    print(f"Created sample {true_path} ({len(sample_true_articles)} records)")

if __name__ == "__main__":
    create_files()
