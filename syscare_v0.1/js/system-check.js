// System Check Assessment JavaScript

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeAssessment();
    });
}

function initializeAssessment() {
    const form = document.getElementById('systemAssessment');
    const inputs = document.querySelectorAll('.assessment-input, input[type="checkbox"]');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    const questionNames = Array.from(new Set(Array.from(inputs)
        .map(input => input.name)
        .filter(Boolean)));
    const totalQuestions = questionNames.length;
    const completionThreshold = Math.max(1, Math.ceil(totalQuestions * 0.75));

    if (progressText) {
        progressText.textContent = `0 / ${totalQuestions} 완료`;
    }
    
    // Track progress
    function updateProgress() {
        const filledInputs = Array.from(inputs).filter(input => {
            if (input.type === 'checkbox') {
                return document.querySelectorAll(`input[name="${input.name}"]:checked`).length > 0;
            }
            return input.value !== '';
        });
        
        // Remove duplicates for checkbox groups
        const uniqueNames = [...new Set(filledInputs.map(input => input.name))];
        const progress = totalQuestions === 0 ? 0 : (uniqueNames.length / totalQuestions) * 100;

        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (progressText) {
            progressText.textContent = `${uniqueNames.length} / ${totalQuestions} 완료`;
        }

        // Enable submit button when all required fields are filled
        const submitBtn = document.getElementById('submitBtn');
        if (uniqueNames.length >= completionThreshold) { // At least 75% questions answered
            submitBtn.disabled = false;
            submitBtn.classList.remove('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
        } else {
            submitBtn.disabled = true;
            submitBtn.classList.add('disabled:bg-gray-400', 'disabled:cursor-not-allowed');
        }
    }
    
    // Add event listeners
    inputs.forEach(input => {
        input.addEventListener('change', updateProgress);
        input.addEventListener('input', updateProgress);
    });

    // Initialize progress state on load
    updateProgress();
    
    // Handle checkbox exclusivity for "none" option in issues
    const issueCheckboxes = document.querySelectorAll('input[name="issues"]');
    issueCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            if (this.value === 'none' && this.checked) {
                issueCheckboxes.forEach(cb => {
                    if (cb.value !== 'none') cb.checked = false;
                });
            } else if (this.value !== 'none' && this.checked) {
                document.querySelector('input[name="issues"][value="none"]').checked = false;
            }
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        processAssessment();
    });
    
    // Phone number formatting
    const phoneInput = document.querySelector('input[type="tel"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/[^0-9]/g, '');
            let formatted = value.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
            e.target.value = formatted;
        });
    }
}

function processAssessment() {
    const formData = new FormData(document.getElementById('systemAssessment'));
    const data = {};
    
    // Process form data
    for (let [key, value] of formData.entries()) {
        if (data[key]) {
            if (Array.isArray(data[key])) {
                data[key].push(value);
            } else {
                data[key] = [data[key], value];
            }
        } else {
            data[key] = value;
        }
    }
    
    // Calculate score and generate results
    const results = calculateScore(data);
    displayResults(results, data);
}

function calculateScore(data) {
    let score = 0;
    let maxScore = 100;
    let recommendations = [];
    let riskLevel = 'low';
    
    // Scoring algorithm
    
    // 1. Company size (5 points max)
    if (data.employees) {
        switch(data.employees) {
            case '1-10': score += 5; break;
            case '11-50': score += 4; break;
            case '51-100': score += 3; break;
            case '100+': score += 2; break;
        }
    }
    
    // 2. Operating systems (10 points max)
    if (data.os) {
        const osArray = Array.isArray(data.os) ? data.os : [data.os];
        if (osArray.includes('windows') && osArray.includes('linux')) {
            score += 10;
        } else if (osArray.length >= 2) {
            score += 8;
        } else if (osArray.length === 1) {
            score += 6;
        }
    } else {
        recommendations.push('운영체제 정보를 확인하고 최신 버전으로 업데이트하세요.');
    }
    
    // 3. Server infrastructure (15 points max)
    if (data.server) {
        switch(data.server) {
            case 'none': score += 8; break;
            case '1': score += 10; break;
            case '2-5': score += 13; break;
            case '6-10': score += 15; break;
            case '10+': score += 12; break;
        }
    } else {
        recommendations.push('서버 인프라를 점검하고 적정 수준을 유지하세요.');
    }
    
    // 4. Network setup (10 points max)
    if (data.network) {
        switch(data.network) {
            case 'basic': score += 5; break;
            case 'managed': score += 8; break;
            case 'enterprise': score += 10; break;
            case 'unsure': score += 3; 
                recommendations.push('네트워크 구성을 전문가에게 점검받아보세요.');
                break;
        }
    }
    
    // 5. Backup strategy (20 points max) - Critical
    if (data.backup) {
        switch(data.backup) {
            case 'none': 
                score += 0; 
                riskLevel = 'high';
                recommendations.push('⚠️ 즉시 백업 시스템을 구축하세요. 데이터 손실 위험이 매우 높습니다.');
                break;
            case 'manual': 
                score += 8;
                riskLevel = 'medium';
                recommendations.push('정기적인 자동 백업 시스템으로 업그레이드하세요.');
                break;
            case 'weekly': score += 15; break;
            case 'daily': score += 18; break;
            case 'realtime': score += 20; break;
        }
    } else {
        recommendations.push('백업 전략을 수립하고 실행하세요.');
    }
    
    // 6. Security solutions (15 points max)
    if (data.security) {
        switch(data.security) {
            case 'none': 
                score += 0;
                riskLevel = 'high';
                recommendations.push('⚠️ 기본적인 보안 솔루션을 즉시 도입하세요.');
                break;
            case 'basic': score += 8; break;
            case 'firewall': score += 12; break;
            case 'enterprise': score += 15; break;
        }
    }
    
    // 7. Update management (10 points max)
    if (data.updates) {
        switch(data.updates) {
            case 'none': 
                score += 0;
                recommendations.push('정기적인 시스템 업데이트가 필요합니다.');
                break;
            case 'manual': score += 6; break;
            case 'scheduled': score += 9; break;
            case 'automated': score += 10; break;
        }
    }
    
    // 8. Current issues (deduct points for problems)
    if (data.issues) {
        const issuesArray = Array.isArray(data.issues) ? data.issues : [data.issues];
        if (!issuesArray.includes('none')) {
            score -= issuesArray.length * 3;
            if (issuesArray.includes('security') || issuesArray.includes('data')) {
                riskLevel = 'high';
            }
            recommendations.push('현재 겪고 있는 문제들을 우선적으로 해결하세요.');
        } else {
            score += 10; // Bonus for no issues
        }
    }
    
    // 9. IT management (5 points max)
    if (data.manager) {
        switch(data.manager) {
            case 'none': 
                score += 0;
                recommendations.push('전산 관리 담당자를 지정하거나 외부 전문가의 도움을 받으세요.');
                break;
            case 'part-time': score += 3; break;
            case 'full-time': score += 5; break;
            case 'external': score += 4; break;
        }
    }
    
    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));
    
    // Determine risk level based on score
    if (score >= 80) riskLevel = 'low';
    else if (score >= 60) riskLevel = 'medium';
    else riskLevel = 'high';
    
    return {
        score: Math.round(score),
        riskLevel: riskLevel,
        recommendations: recommendations
    };
}

function displayResults(results, data) {
    const modal = document.getElementById('resultsModal');
    const scoreElement = document.getElementById('totalScore');
    const contentElement = document.getElementById('resultsContent');
    
    // Update score
    scoreElement.textContent = results.score;
    
    // Create score chart
    createScoreChart(results.score);
    
    // Generate content
    let riskColor, riskText, riskDescription;
    switch(results.riskLevel) {
        case 'low':
            riskColor = 'text-green-600';
            riskText = '양호';
            riskDescription = '전산 시스템이 안정적으로 관리되고 있습니다.';
            break;
        case 'medium':
            riskColor = 'text-yellow-600';
            riskText = '주의';
            riskDescription = '일부 개선이 필요한 부분이 있습니다.';
            break;
        case 'high':
            riskColor = 'text-red-600';
            riskText = '위험';
            riskDescription = '즉시 개선이 필요한 부분들이 있습니다.';
            break;
    }
    
    contentElement.innerHTML = `
        <div class="bg-gray-50 p-6 rounded-xl">
            <div class="text-center mb-6">
                <h3 class="text-2xl font-bold mb-2">위험도: <span class="${riskColor}">${riskText}</span></h3>
                <p class="text-gray-700">${riskDescription}</p>
            </div>
            
            ${results.score >= 80 ? `
                <div class="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-800 mb-2">
                        <i class="fas fa-check-circle mr-2"></i>
                        우수한 전산 관리 상태
                    </h4>
                    <p class="text-green-700 text-sm">
                        현재 전산 시스템이 안정적으로 관리되고 있습니다. 
                        정기적인 점검을 통해 이 상태를 유지하시기 바랍니다.
                    </p>
                </div>
            ` : `
                <div class="bg-${results.riskLevel === 'high' ? 'red' : 'yellow'}-50 border border-${results.riskLevel === 'high' ? 'red' : 'yellow'}-200 p-4 rounded-lg">
                    <h4 class="font-semibold text-${results.riskLevel === 'high' ? 'red' : 'yellow'}-800 mb-2">
                        <i class="fas fa-exclamation-triangle mr-2"></i>
                        개선 권장 사항
                    </h4>
                    <ul class="text-${results.riskLevel === 'high' ? 'red' : 'yellow'}-700 text-sm space-y-1">
                        ${results.recommendations.map(rec => `<li>• ${rec}</li>`).join('')}
                    </ul>
                </div>
            `}
        </div>
        
        <div class="grid md:grid-cols-2 gap-6">
            <div class="bg-white border p-6 rounded-xl">
                <h4 class="font-semibold mb-4 text-gray-900">
                    <i class="fas fa-lightbulb text-yellow-500 mr-2"></i>
                    맞춤 개선 방안
                </h4>
                <div class="space-y-3 text-sm">
                    ${generateCustomRecommendations(data, results).map(rec => `
                        <div class="flex items-start">
                            <i class="fas fa-arrow-right text-blue-500 mt-1 mr-2 text-xs"></i>
                            <span class="text-gray-700">${rec}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="bg-white border p-6 rounded-xl">
                <h4 class="font-semibold mb-4 text-gray-900">
                    <i class="fas fa-calendar-check text-green-500 mr-2"></i>
                    권장 실행 순서
                </h4>
                <div class="space-y-3 text-sm">
                    ${generatePriorityActions(results).map((action, index) => `
                        <div class="flex items-start">
                            <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded mr-2 mt-0.5">${index + 1}</span>
                            <span class="text-gray-700">${action}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="bg-blue-50 p-6 rounded-xl">
            <h4 class="font-semibold mb-4 text-blue-900">
                <i class="fas fa-info-circle mr-2"></i>
                SYSCARE 서비스 추천
            </h4>
            <p class="text-blue-800 mb-4">
                귀하의 진단 결과를 바탕으로 다음 서비스를 추천드립니다:
            </p>
            <div class="grid md:grid-cols-3 gap-4">
                <div class="bg-white p-4 rounded-lg text-center">
                    <i class="fas fa-shield-alt text-blue-600 text-2xl mb-2"></i>
                    <h5 class="font-semibold text-gray-900 mb-1">예방 점검</h5>
                    <p class="text-xs text-gray-600">정기적인 시스템 점검</p>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <i class="fas fa-chart-line text-green-600 text-2xl mb-2"></i>
                    <h5 class="font-semibold text-gray-900 mb-1">모니터링</h5>
                    <p class="text-xs text-gray-600">24/7 시스템 감시</p>
                </div>
                <div class="bg-white p-4 rounded-lg text-center">
                    <i class="fas fa-tools text-orange-600 text-2xl mb-2"></i>
                    <h5 class="font-semibold text-gray-900 mb-1">유지보수</h5>
                    <p class="text-xs text-gray-600">전문 기술 지원</p>
                </div>
            </div>
        </div>
    `;
    
    // Show modal
    modal.classList.remove('hidden');
    
    // Send results via email (placeholder)
    if (data.email) {
        setTimeout(() => {
            alert(`상세한 분석 리포트가 ${data.email}로 발송되었습니다.`);
        }, 2000);
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = {
        calculateScore
    };
}

function createScoreChart(score) {
    const ctx = document.getElementById('scoreChart').getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: [
                    score >= 80 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444',
                    '#E5E7EB'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '70%',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

function generateCustomRecommendations(data, results) {
    const recommendations = [];
    
    if (!data.backup || data.backup === 'none' || data.backup === 'manual') {
        recommendations.push('자동화된 백업 시스템 구축');
    }
    
    if (!data.security || data.security === 'none' || data.security === 'basic') {
        recommendations.push('통합 보안 솔루션 도입');
    }
    
    if (!data.manager || data.manager === 'none') {
        recommendations.push('전산 관리 담당자 지정 또는 아웃소싱');
    }
    
    if (data.issues && Array.isArray(data.issues) && data.issues.includes('slow')) {
        recommendations.push('시스템 성능 최적화');
    }
    
    if (data.network === 'basic' || data.network === 'unsure') {
        recommendations.push('네트워크 인프라 업그레이드');
    }
    
    recommendations.push('정기적인 시스템 점검 계획 수립');
    
    return recommendations.slice(0, 5); // 최대 5개 추천사항
}

function generatePriorityActions(results) {
    const actions = [];
    
    if (results.riskLevel === 'high') {
        actions.push('즉시 백업 시스템 구축');
        actions.push('기본 보안 솔루션 설치');
        actions.push('긴급 시스템 점검 실시');
    } else if (results.riskLevel === 'medium') {
        actions.push('백업 정책 개선');
        actions.push('보안 수준 강화');
        actions.push('정기 점검 계획 수립');
    } else {
        actions.push('현재 수준 유지');
        actions.push('정기 점검 지속');
        actions.push('최신 기술 동향 파악');
    }
    
    actions.push('전문가 상담 받기');
    actions.push('장기 발전 계획 수립');
    
    return actions.slice(0, 5);
}

function closeModal() {
    document.getElementById('resultsModal').classList.add('hidden');
}