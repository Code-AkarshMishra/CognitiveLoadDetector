package AI_Cognitive_Load_Detection.Backend;

public class BehavioralDataRequest {
    private double typingWpm;
    private int totalClicks;
    private int tabSwitches;
    private double idleSeconds;

    public double getTypingWpm() {
        return typingWpm;
    }

    public int getTotalClicks() {
        return totalClicks;
    }

    public int getTabSwitches() {
        return tabSwitches;
    }

    public double getIdleSeconds() {
        return idleSeconds;
    }

    public void setTypingWpm(double typingWpm) {
        this.typingWpm = typingWpm;
    }

    public void setTotalClicks(int totalClicks) {
        this.totalClicks = totalClicks;
    }

    public void setTabSwitches(int tabSwitches) {
        this.tabSwitches = tabSwitches;
    }

    public void setIdleSeconds(double idleSeconds) {
        this.idleSeconds = idleSeconds;
    }
}
